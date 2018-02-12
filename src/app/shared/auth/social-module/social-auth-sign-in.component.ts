import { Component, OnInit } from '@angular/core';

import { SocialAuthService } from './social-auth.service';
import { FacebookLoginProvider } from './providers/facebook-login-provider';
import { GoogleLoginProvider } from './providers/google-login-provider';

@Component({
    selector: 'app-social-auth-sign-in',
    template: `
    	<button mat-raised-button (click)="signInWithGoogle()">Google</button>
    	<button mat-raised-button (click)="signInWithFacebook()">Facebook</button>
    `,
})
export class SocialAuthSignInComponent implements OnInit {
    constructor(private socialAuthService: SocialAuthService) {
        socialAuthService.authState.subscribe(res => console.log(res));
    }

    ngOnInit() {}

    signInWithGoogle() {
        this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    }

    signInWithFacebook() {
        this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    }
}
