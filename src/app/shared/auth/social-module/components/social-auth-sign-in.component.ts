import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

import { SocialAuthService } from '../social-auth.service';
import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'app-social-auth-sign-in',
    templateUrl: 'social-auth-sign-in.component.html',
})
export class SocialAuthSignInComponent implements OnInit, OnDestroy {
    destroy: Subject<any> = new Subject();

    constructor(
        private socialAuthService: SocialAuthService,
        public auth: AuthService,
        public router: Router,
        private snackbar: MatSnackBar
    ) {}

    ngOnInit() {
        this.auth.user$.takeUntil(this.destroy).subscribe(user => {
            if (user === null) {
            } else if (this.auth.isAuthenticatedUser(user) && !user.isAnonymous) {
                this.router.navigate(['/account']);
            } else if (this.auth.isHttpErrorResponse(user)) {
                this.auth.errorHandled();
                this.snackbar.open(`Unknown error, sorry about that.`, `OK`, {
                    duration: 5000,
                });
            }
        });
    }

    signInWithGoogle() {
        this.socialAuthService.signIn('google');
    }

    signInWithFacebook() {
        this.socialAuthService.signIn('facebook');
    }

    ngOnDestroy() {
        this.destroy.next();
    }
}
