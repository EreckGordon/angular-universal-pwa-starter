import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'sign-in',
    templateUrl: './sign-in.html'
})

export class SignInComponent implements OnInit {

    form: FormGroup;
    destroy: Subject<any> = new Subject();

    constructor (private fb: FormBuilder, public auth: AuthService, private router: Router) { }

    ngOnInit() {
        this.form = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });

        this.auth.user$.takeUntil(this.destroy).subscribe(user => {
            if (user === null) {} // null check so it doesn't break the component
            else if (!!user.id && !user.isAnonymous) this.router.navigate(['/protected']);
            else if (user === 'user does not exist') {
                this.form.patchValue({ email: '', password: '' })
            }
            else if (user === 'Password Invalid') {
                this.form.patchValue({ password: '' })
            }
        })
    }

    signIn(): void {
        this.auth.loginWithEmailAndPassword(this.form.value);
    }

    ngOnDestroy() {
        this.destroy.next()
    }
}
