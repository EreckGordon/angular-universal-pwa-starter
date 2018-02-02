import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { MatSnackBar } from '@angular/material';


@Component({
    selector: 'app-request-password-reset',
    templateUrl: './request-password-reset.component.html'
})

export class RequestPasswordResetComponent implements OnInit, OnDestroy {

    form: FormGroup;
    destroy: Subject<any> = new Subject();
    requestSent: boolean = false;

    constructor (private fb: FormBuilder, public auth: AuthService, private router: Router, private snackbar: MatSnackBar) { }

    ngOnInit() {
        this.form = this.fb.group({
            email: ['', Validators.required]
        });

        this.auth.user$.takeUntil(this.destroy).subscribe(user => {
            if (user === null) { } // null check so it doesn't break the component
            else if (this.auth.isHttpErrorResponse(user) && user.error === 'user does not exist') {
                this.requestSent = false;
                this.auth.errorHandled();
                this.snackbar.open(`User does not exist in our database`, `OK`, { duration: 10000 });
                this.form.patchValue({ email: '' });
            }
        })
    }

    requestPasswordReset(): void {
        this.requestSent = true;
        this.auth.requestPasswordReset(this.form.value);
    }

    ngOnDestroy() {
        this.destroy.next();
    }
}
