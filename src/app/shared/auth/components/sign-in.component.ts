import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';

import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html'
})

export class SignInComponent implements OnInit, OnDestroy {

    form: FormGroup;
    destroy: Subject<any> = new Subject();
    showPassword: boolean = false;

    constructor (private fb: FormBuilder, public auth: AuthService, private router: Router, private snackbar: MatSnackBar) { }

    ngOnInit() {
        this.form = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });

        this.auth.user$.takeUntil(this.destroy).subscribe(user => {
            if (user === null) { } // null check so it doesn't break the component
            else if (this.auth.isAuthenticatedUser(user) && !user.isAnonymous) this.router.navigate(['/account']);
            else if (this.auth.isHttpErrorResponse(user) && user.error === 'user does not exist') {
                this.auth.errorHandled();
                this.form.patchValue({ email: '', password: '' });
                this.snackbar.open(`User does not exist`, `OK`, { duration: 5000 });
            }
            else if (this.auth.isHttpErrorResponse(user) && user.error === 'Password Invalid') {
                this.auth.errorHandled();
                this.snackbar.open(`Invalid Password`, `OK`, { duration: 5000 });
                this.form.patchValue({ password: '' });
            }
        })
    }

    signIn(): void {
        this.auth.loginWithEmailAndPassword(this.form.value);
    }

    toggleShowPassword() {
        this.showPassword = !this.showPassword;
    }

    ngOnDestroy() {
        this.destroy.next();
    }
}
