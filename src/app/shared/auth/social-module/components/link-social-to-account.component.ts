import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

import { SocialAuthService } from '../social-auth.service';
import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'app-link-social-to-account',
    templateUrl: 'link-social-to-account.component.html',
})
export class LinkSocialToAccountComponent implements OnInit, OnDestroy {
    destroy: Subject<any> = new Subject();
    hasAnyAuthProvider: boolean;
    hasGoogleAuthProvider: boolean;
    hasFacebookAuthProvider: boolean;

    constructor(
        private socialAuthService: SocialAuthService,
        public auth: AuthService,
        public router: Router,
        private snackbar: MatSnackBar
    ) {}

    ngOnInit() {
        this.auth.user$.takeUntil(this.destroy).subscribe(user => {
            if (user === null) {
            } else if (this.auth.isAuthenticatedUser(user) && this.hasAnyAuthProvider === undefined) {
                this.hasAnyAuthProvider = user.authProviders.length > 0;
                this.hasGoogleAuthProvider = user.authProviders.includes('google');
                this.hasFacebookAuthProvider = user.authProviders.includes('facebook');
            } else if (this.auth.isAuthenticatedUser(user) && !!this.hasAnyAuthProvider) {
                this.router.navigate(['/account']);
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
