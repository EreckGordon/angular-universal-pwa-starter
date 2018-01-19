import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { AuthService, AuthenticatedUser } from '../services/auth.service';

@Component({
    selector: 'sign-in',
    templateUrl: './sign-in.html'
})

export class SignInComponent implements OnInit, OnDestroy {

    form: FormGroup;
    destroy: Subject<any> = new Subject();

    constructor (private fb: FormBuilder, public auth: AuthService, private router: Router) { }

    ngOnInit() {
        this.form = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });

        this.auth.user$.takeUntil(this.destroy).subscribe(user => {
            if (this.isAuthenticatedUser(user) && !user.isAnonymous) this.router.navigate(['/protected']);
            
            else if (this.isHttpErrorResponse(user) && user.error === 'user does not exist') {
                this.form.patchValue({ email: '', password: '' })
            }
            else if (this.isHttpErrorResponse(user) && user.error === 'Password Invalid') {
                this.form.patchValue({ password: '' })
            }
        })
    }

    isAuthenticatedUser(user: AuthenticatedUser | HttpErrorResponse): user is AuthenticatedUser {
        return (<AuthenticatedUser>user).id !== undefined;
    }

    isHttpErrorResponse(user: AuthenticatedUser | HttpErrorResponse): user is HttpErrorResponse {
        return (<HttpErrorResponse>user).error !== undefined;
    }

    signIn(): void {
        this.auth.loginWithEmailAndPassword(this.form.value);
    }

    ngOnDestroy() {
        this.destroy.next();
    }
}
