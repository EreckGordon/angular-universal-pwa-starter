import { Component } from '@angular/core';

import { SocialAuthService } from '../social-auth.service';

@Component({
    selector: 'app-social-auth-sign-in',
    templateUrl: 'social-auth-sign-in.component.html',
})
export class SocialAuthSignInComponent {
    constructor(private socialAuthService: SocialAuthService) {}

    signInWithGoogle() {
        this.socialAuthService.signIn('google');
    }

    signInWithFacebook() {
        this.socialAuthService.signIn('facebook');
    }
}
