import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import * as jwt from 'jsonwebtoken';

import { TitleAndMetaTags } from '@interfaces/title-and-meta-tags.interface';

import { SEOService } from '@seo/seo.service';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
    titleAndMetaTags: TitleAndMetaTags = {
        title: 'Reset Password',
        description: 'Enter your new password, and we will update our records and log you in.',
    };
    // prettier-ignore
    jsonLdSchema = {
        '@context': 'https://schema.org/'
    };
    form: FormGroup;
    destroy: Subject<any> = new Subject();
    encodedToken: string;
    decodedToken: Object = {};
    showPassword = false;
    requestSent = false;

    constructor(
        private seoService: SEOService,
        private fb: FormBuilder,
        public auth: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private snackbar: MatSnackBar
    ) {
        this.seoService.setTitleAndMetaTags(this.titleAndMetaTags);
    }

    ngOnInit() {
        this.form = this.fb.group({
            password: ['', Validators.required],
        });

        this.route.queryParams.take(1).subscribe(params => {
            if (!!params.token) {
                this.encodedToken = params.token;
                this.decodedToken = jwt.decode(params.token);
            } else {
                this.encodedToken = 'does not exist';
                this.decodedToken['email'] = 'does not exist';
            }
        });

        this.auth.user$.takeUntil(this.destroy).subscribe(user => {
            if (user === null) {
            } else if (this.auth.isAuthenticatedUser(user) && user.isAnonymous) {
            } else if (this.auth.isHttpErrorResponse(user)) {
                this.handlePasswordError(user);
            } else if (this.auth.isAuthenticatedUser(user) && user.email === this.decodedToken['email']) {
                this.router.navigate(['/account']);
            }
        });
    }

    handlePasswordError(error: HttpErrorResponse) {
        this.requestSent = false;
        this.auth.errorHandled();
        this.form.patchValue({ password: '' });
        if (Array.isArray(error.error)) {
            switch (error.error[0]) {
                case 'min':
                    return this.snackbar.open(`Password is too short`, `OK`, {
                        duration: 5000,
                    });

                case 'oneOf':
                    return this.snackbar.open(`Pick a better password`, `OK`, {
                        duration: 5000,
                    });

                default:
                    return this.snackbar.open(`${error.error[0]}`, `OK`, {
                        duration: 5000,
                    });
            }
        }
        return this.snackbar.open(`${error.error}`, `OK`, { duration: 5000 });
    }

    resetPassword(): void {
        this.requestSent = true;
        this.auth.resetPassword({
            password: this.form.value.password,
            token: this.encodedToken,
        });
    }

    toggleShowPassword() {
        this.showPassword = !this.showPassword;
    }

    ngOnDestroy() {
        this.destroy.next();
    }
}
