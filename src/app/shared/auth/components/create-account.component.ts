import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';

import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { RecaptchaComponent } from 'ng-recaptcha';


@Component({
    selector: 'app-create-account',
    templateUrl: './create-account.component.html'
})

export class CreateAccountComponent implements OnInit, OnDestroy {

    form: FormGroup;
    destroy: Subject<any> = new Subject();
    showPassword: boolean = false;
    @ViewChild('recaptcha') recaptcha: RecaptchaComponent;

    constructor (private fb: FormBuilder, public auth: AuthService, private router: Router, private snackbar: MatSnackBar) { }

    ngOnInit() {
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            recaptcha: [null, Validators.required]
        });

        this.auth.user$.takeUntil(this.destroy).subscribe(user => {
            if (user === null) { } // null check so it doesn't break the component
            else if (this.auth.isAuthenticatedUser(user) && !user.isAnonymous) this.router.navigate(['/account']);
            else if (this.auth.isHttpErrorResponse(user) && user.error === 'Email already in use') {
                this.auth.errorHandled();
                this.form.patchValue({ email: '' });
                this.recaptcha.reset();
                return this.snackbar.open(`Email is already in use.`, `OK`, { duration: 5000 });
            }
            else if (this.auth.isHttpErrorResponse(user) && Array.isArray(user.error)) { // password validation errors. 
                this.auth.errorHandled();
                this.form.patchValue({ password: '' });
                this.recaptcha.reset();
                switch (user.error[0]) {
                    case "min":
                        return this.snackbar.open(`Password is too short`, `OK`, { duration: 5000 });

                    case "oneOf":
                        return this.snackbar.open(`Pick a better password`, `OK`, { duration: 5000 });
                }
            }
        })
    }

    createUserWithEmailAndPassword(): void {
        if (this.form.valid) this.auth.createEmailAndPasswordUser(this.form.value);
        else {
            this.recaptcha.reset();
            this.snackbar.open(`Please enter a valid email address`, `OK`, { duration: 5000 });
        }
    }

    toggleShowPassword() {
        this.showPassword = !this.showPassword;
    }

    ngOnDestroy() {
        this.destroy.next();
    }
}
