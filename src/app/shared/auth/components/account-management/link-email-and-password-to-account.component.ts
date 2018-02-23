import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';

import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { RecaptchaComponent } from 'ng-recaptcha';

@Component({
    selector: 'app-link-email-and-password-to-account',
    templateUrl: 'link-email-and-password-to-account.component.html',
})
export class LinkEmailAndPasswordToAccountComponent implements OnInit, OnDestroy {
    form: FormGroup;
    destroy: Subject<any> = new Subject();
    @ViewChild('recaptcha') recaptcha: RecaptchaComponent;
    showPassword = false;

    constructor(public auth: AuthService, public router: Router, private snackbar: MatSnackBar, private fb: FormBuilder) {}

    ngOnInit() {
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            recaptcha: [null, Validators.required],
        });

        this.auth.user$.takeUntil(this.destroy).subscribe(user => {
            if (user === null) {
            } else if (this.auth.isHttpErrorResponse(user) && user.error === 'Password Invalid') {
                this.auth.errorHandled();
                this.form.patchValue({ password: '' });
                this.recaptcha.reset();
                this.snackbar.open(`Your password is invalid`, `OK`, {
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
            } else if (this.auth.isAuthenticatedUser(user) && user.authProviders.includes('emailAndPassword')) {
                this.router.navigate(['/account']);
            }
        });
    }

    linkEmailAndPasswordToAccount() {
        const formValue = this.form.value;
        console.log(formValue);
        this.auth.linkProviderToAccount({
            email: formValue.email,
            password: formValue.password,
            provider: 'emailAndPassword',
        });
    }

    toggleShowPassword() {
        this.showPassword = !this.showPassword;
    }

    ngOnDestroy() {
        this.destroy.next();
    }
}
