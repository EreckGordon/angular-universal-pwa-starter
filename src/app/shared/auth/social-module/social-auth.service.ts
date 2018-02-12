import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';

import { environment } from '../../../../environments/environment';

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

    private providers: Map<string, LoginProvider>;

    private _user: SocialUser = null;
    private _authState: BehaviorSubject<SocialUser> = new BehaviorSubject(null);

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

    get authState(): Observable<SocialUser> {
        return this._authState.asObservable();
    }

    constructor(public authService: AuthService) {
        this.providers = this.config.providers;

        this.providers.forEach((provider: LoginProvider, key: string) => {
            provider
                .initialize()
                .then((user: SocialUser) => {
                    console.log('then initialized block');
                    user.provider = key;

                    this._user = user;
                    this._authState.next(user);
                })
                .catch(err => {
                    // this._authState.next(null);
                });
        });
    }

    // to do: initialize only the needed provider than all at once as is currently done.
    //initializeProvider(){}

    signIn(providerId: string, opt?: LoginOptions): Promise<SocialUser> {
        return new Promise((resolve, reject) => {
            let providerObject = this.providers.get(providerId);
            if (providerObject) {
                providerObject.signIn().then((user: SocialUser) => {
                    user.provider = providerId;
                    resolve(user);

                    this._user = user;
                    this._authState.next(user);
                });
            } else {
                reject(SocialAuthService.ERR_LOGIN_PROVIDER_NOT_FOUND);
            }
        });
    }

    signOut(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this._user) {
                reject(SocialAuthService.ERR_NOT_LOGGED_IN);
            } else {
                let providerId = this._user.provider;
                let providerObject = this.providers.get(providerId);
                if (providerObject) {
                    providerObject.signOut().then(() => {
                        resolve();

                        this._user = null;
                        this._authState.next(null);
                    });
                } else {
                    reject(SocialAuthService.ERR_LOGIN_PROVIDER_NOT_FOUND);
                }
            }
        });
    }
}
