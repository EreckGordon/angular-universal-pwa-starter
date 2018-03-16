import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { environment } from '@environments/environment';

import { AuthService } from '../auth.service';

import { LoginProvider } from './interfaces/login-provider.interface';
import { LoginOptions } from './interfaces/login-options.interface';
import { SocialUser } from './classes/social-user.class';
import { SocialAuthServiceConfig } from './classes/social-auth-service-config.class';
import { FacebookLoginProvider } from './providers/facebook-login-provider';
import { GoogleLoginProvider } from './providers/google-login-provider';

@Injectable()
export class SocialAuthService {
    private static readonly ERR_LOGIN_PROVIDER_NOT_FOUND = 'Login provider not found';
    private static readonly ERR_NOT_LOGGED_IN = 'Not logged in';
    private config = new SocialAuthServiceConfig([
        {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleLoginProvider),
        },
        {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(environment.facebookLoginProvider),
        },
    ]);
    private providers: Map<string, LoginProvider> = this.config.providers;

    constructor(public authService: AuthService, @Inject(PLATFORM_ID) private platformId: Object) {
        this.providers = this.config.providers;
        if (isPlatformBrowser(this.platformId)) {
            this.providers.forEach((provider: LoginProvider, key: string) => provider.initialize());
        }
    }

    signIn(providerId: string, opt?: LoginOptions): Promise<SocialUser> {
        return new Promise((resolve, reject) => {
            const providerObject = this.providers.get(providerId);
            if (providerObject) {
                providerObject.signIn().then((user: SocialUser) => {
                    user.provider = providerId;
                    this.authService.signInWithSocialUser(user);
                });
            } else {
                reject(SocialAuthService.ERR_LOGIN_PROVIDER_NOT_FOUND);
            }
        });
    }

    signOut(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.authService.user$.take(1).subscribe(user => {
                if (user['providerId'] !== ('google' || 'facebook')) {
                    reject(SocialAuthService.ERR_NOT_LOGGED_IN);
                } else {
                    const providerId = user['providerId'];
                    const providerObject = this.providers.get(providerId);
                    if (providerObject) {
                        providerObject.signOut().then(() => {
                            resolve();
                        });
                    } else {
                        reject(SocialAuthService.ERR_LOGIN_PROVIDER_NOT_FOUND);
                    }
                }
            });
        });
    }
}
