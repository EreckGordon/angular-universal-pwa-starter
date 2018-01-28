import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'app-create-account',
    templateUrl: './create-account.component.html'
})

export class CreateAccountComponent implements OnInit, OnDestroy {

    form: FormGroup;
    destroy: Subject<any> = new Subject();
    showPassword: boolean = false;

    constructor (private fb: FormBuilder, public auth: AuthService, private router: Router) { }

    ngOnInit() {
        this.form = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });

        this.auth.user$.takeUntil(this.destroy).subscribe(user => {
            if (user === null) { } // null check so it doesn't break the component
            else if (this.auth.isAuthenticatedUser(user) && !user.isAnonymous) this.router.navigate(['/account']);
            else if (this.auth.isHttpErrorResponse(user) && user.error === 'Email already in use') {
                this.form.patchValue({ email: '' })
            }
            else if (this.auth.isHttpErrorResponse(user) && Array.isArray(user.error)) { // password validation errors. to do: handle the specifics in snackbar
                this.form.patchValue({ password: '' })
            }
        })
    }

    createUserWithEmailAndPassword(): void {
        this.auth.createEmailAndPasswordUser(this.form.value);
    }

    toggleShowPassword() {
        this.showPassword = !this.showPassword;
    }

    ngOnDestroy() {
        this.destroy.next();
    }
}
