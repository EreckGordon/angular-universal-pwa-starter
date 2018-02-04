import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { MatSnackBar } from '@angular/material';
import { RecaptchaComponent } from 'ng-recaptcha';

@Component({
    selector: 'app-request-password-reset',
    templateUrl: './request-password-reset.component.html',
})
export class RequestPasswordResetComponent implements OnInit, OnDestroy {
    form: FormGroup;
    destroy: Subject<any> = new Subject();
    requestSent = false;
    @ViewChild('recaptcha') recaptcha: RecaptchaComponent;

    constructor(
        private fb: FormBuilder,
        public auth: AuthService,
        private router: Router,
        private snackbar: MatSnackBar
    ) {}

    ngOnInit() {
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            recaptcha: [null, Validators.required],
        });

        this.auth.user$.takeUntil(this.destroy).subscribe(user => {
            if (user === null) {
            } else if (
                this.auth.isHttpErrorResponse(user) &&
                user.error === 'user does not exist'
            ) {
                this.requestSent = false;
                this.form.patchValue({ email: '' });
                this.recaptcha.reset();
                this.auth.errorHandled();
                this.snackbar.open(`User does not exist`, `OK`, {
                    duration: 10000,
                });
            }
        });
    }

    requestPasswordReset(): void {
        this.requestSent = true;
        this.auth.requestPasswordReset(this.form.value);
    }

    ngOnDestroy() {
        this.destroy.next();
    }
}
