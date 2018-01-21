import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'app-request-password-reset',
    templateUrl: './request-password-reset.component.html'
})

export class RequestPasswordResetComponent implements OnInit, OnDestroy {

    form: FormGroup;
    destroy: Subject<any> = new Subject();

    constructor (private fb: FormBuilder, public auth: AuthService, private router: Router) { }

    ngOnInit() {
        this.form = this.fb.group({
            email: ['', Validators.required]
        });

        this.auth.user$.takeUntil(this.destroy).subscribe(user => {
            if (user === null) { } // null check so it doesn't break the component
            else if (this.auth.isHttpErrorResponse(user) && user.error === 'user does not exist') {
                // to do: snackbar: email does not exist
                this.form.patchValue({ email: '' })
            }
        })
    }

    requestPasswordReset(): void {
        // to do: implement below non-existent auth function
        //this.auth.requestPasswordReset(this.form.value);
        this.router.navigate(['/sign-in'])
    }

    ngOnDestroy() {
        this.destroy.next();
    }
}
