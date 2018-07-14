import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';

import { RecaptchaComponent } from 'ng-recaptcha';
import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from '../../auth.service';
import { SocialAuthService } from '../social-auth.service';

@Component({
    selector: 'app-link-social-to-account',
    templateUrl: 'link-social-to-account.component.html',
})
export class LinkSocialToAccountComponent implements OnInit, OnDestroy {
    destroy: Subject<any> = new Subject();
    form: FormGroup;
    @ViewChild('recaptcha') recaptcha: RecaptchaComponent;
    hasAnyAuthProvider: boolean;
    hasGoogleAuthProvider: boolean;
    hasFacebookAuthProvider: boolean;

    constructor(
        private fb: FormBuilder,
        private socialAuthService: SocialAuthService,
        public auth: AuthService,
        public router: Router,
        private snackbar: MatSnackBar
    ) {}

    ngOnInit() {
        this.form = this.fb.group({
            recaptcha: [null, Validators.required],
        });

        this.auth.user$.pipe(takeUntil(this.destroy)).subscribe(user => {
            if (user === null) {
            } else if (this.auth.isAuthenticatedUser(user) && this.hasAnyAuthProvider === undefined) {
                this.hasAnyAuthProvider = user.authProviders.length > 0;
                this.hasGoogleAuthProvider = user.authProviders.includes('google');
                this.hasFacebookAuthProvider = user.authProviders.includes('facebook');
            } else if (this.auth.isAuthenticatedUser(user) && !!this.hasAnyAuthProvider) {
                this.router.navigate(['/account']);
            }
        });

        this.auth.additionalProviderError$.pipe(takeUntil(this.destroy)).subscribe(error => {
            if (error === null) {
            } else {
                this.auth.additionalProviderErrorHandled();
                this.recaptcha.reset();
                this.snackbar.open(`Unknown error, sorry about that.`, `OK`, {
                    duration: 5000,
                });
            }
        });
    }

    signInWithGoogle() {
        this.socialAuthService.signIn('google');
    }

    signInWithFacebook() {
        this.socialAuthService.signIn('facebook');
    }

    ngOnDestroy() {
        this.destroy.next();
    }
}
