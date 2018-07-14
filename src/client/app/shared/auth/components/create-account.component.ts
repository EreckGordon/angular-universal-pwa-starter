import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';

import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RecaptchaComponent } from 'ng-recaptcha';

import { TitleAndMetaTags } from '@interfaces/title-and-meta-tags.interface';

import { AuthService } from '../auth.service';
import { SEOService } from '@seo/seo.service';

@Component({
    selector: 'app-create-account',
    templateUrl: './create-account.component.html',
})
export class CreateAccountComponent implements OnInit, OnDestroy {
    titleAndMetaTags: TitleAndMetaTags = {
        title: 'Create New Account',
        description: 'Enter your email and a password and we will sign you up.',
    };
    // prettier-ignore
    jsonLdSchema = {
        '@context': 'https://schema.org/'
    };
    form: FormGroup;
    destroy: Subject<any> = new Subject();
    showPassword = false;
    @ViewChild('recaptcha') recaptcha: RecaptchaComponent;

    constructor(
        private seoService: SEOService,
        private fb: FormBuilder,
        public auth: AuthService,
        private router: Router,
        private snackbar: MatSnackBar
    ) {
        this.seoService.setTitleAndMetaTags(this.titleAndMetaTags);
    }

    ngOnInit() {
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            recaptcha: [null, Validators.required],
        });

        this.auth.user$.pipe(takeUntil(this.destroy)).subscribe(user => {
            if (user === null) {
            } else if (this.auth.isAuthenticatedUser(user) && !user.isAnonymous) {
                this.router.navigate(['/account']);
            } else if (this.auth.isHttpErrorResponse(user) && user.error === 'Email already in use') {
                this.auth.errorHandled();
                this.form.patchValue({ email: '' });
                this.recaptcha.reset();
                return this.snackbar.open(`Email is already in use.`, `OK`, {
                    duration: 5000,
                });
            } else if (this.auth.isHttpErrorResponse(user) && Array.isArray(user.error)) {
                // password validation errors.
                this.auth.errorHandled();
                this.form.patchValue({ password: '' });
                this.recaptcha.reset();
                switch (user.error[0]) {
                    case 'min':
                        return this.snackbar.open(`Password is too short`, `OK`, {
                            duration: 5000,
                        });

                    case 'oneOf':
                        return this.snackbar.open(`Pick a better password`, `OK`, {
                            duration: 5000,
                        });
                }
            }
        });
    }

    createUserWithEmailAndPassword(): void {
        if (this.form.valid) {
            this.auth.createEmailAndPasswordUserOrUpgradeAnonymousToEmailAndPassword(this.form.value);
        } else {
            this.recaptcha.reset();
            this.snackbar.open(`Please enter a valid email address`, `OK`, {
                duration: 5000,
            });
        }
    }

    toggleShowPassword() {
        this.showPassword = !this.showPassword;
    }

    ngOnDestroy() {
        this.destroy.next();
    }
}
