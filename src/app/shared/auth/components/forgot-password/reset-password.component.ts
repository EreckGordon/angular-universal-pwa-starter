import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import * as jwt from 'jsonwebtoken';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html'
})

export class ResetPasswordComponent implements OnInit, OnDestroy {

    form: FormGroup;
    destroy: Subject<any> = new Subject();
    encodedToken: string;
    decodedToken: Object = {};
    showPassword: boolean = false;

    constructor (private fb: FormBuilder, public auth: AuthService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        this.form = this.fb.group({
            password: ['', Validators.required]
        });

        this.route.queryParams.take(1).subscribe(params => {
            if (!!params.token) {
                this.encodedToken = params.token;
                this.decodedToken = jwt.decode(params.token);
            }
            else {
                this.encodedToken = 'does not exist';
                this.decodedToken["email"] = 'does not exist';
            }
        });

        this.auth.user$.takeUntil(this.destroy).subscribe(user => {
            if (user === null) { } // null check so it doesn't break the component
            else if (this.auth.isAuthenticatedUser(user) && user.isAnonymous) { }
            else if (this.auth.isAuthenticatedUser(user) && user.email === this.decodedToken["email"]) {
                this.router.navigate(['/account'])
            }
        });

    }

    resetPassword(): void {
        this.auth.resetPassword({ password: this.form.value.password, token: this.encodedToken });
        // to do: snackbar that informs that password reset has been sent.
        //to do: disable button after request sent.
    }

    toggleShowPassword() {
        this.showPassword = !this.showPassword;
    }

    ngOnDestroy() {
        this.destroy.next();
    }
}
