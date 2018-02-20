import { BaseLoginProvider } from '../classes/base-login-provider.class';
import { SocialUser } from '../classes/social-user.class';
import { LoginOptions } from '../interfaces/login-options.interface';

declare let gapi: any;

export class GoogleLoginProvider extends BaseLoginProvider {
    public static readonly PROVIDER_ID: string = 'google';

    protected auth2: any;

    constructor(private clientId: string, private opt: LoginOptions = { scope: 'email' }) {
        super();
    }

    initialize(): Promise<SocialUser> {
        return new Promise((resolve, reject) => {
            this.loadScript(GoogleLoginProvider.PROVIDER_ID, '//apis.google.com/js/platform.js', () => {
                gapi.load('auth2', () => {
                    this.auth2 = gapi.auth2.init({
                        ...this.opt,
                        client_id: this.clientId,
                    });

                    this.auth2.then(() => {
                        if (this.auth2.isSignedIn.get()) {
                            let user: SocialUser = new SocialUser();
                            let profile = this.auth2.currentUser.get().getBasicProfile();
                            let token = this.auth2.currentUser.get().getAuthResponse(true).access_token;
                            let backendToken = this.auth2.currentUser.get().getAuthResponse(true).id_token;

                            user.socialUid = profile.getId();
                            user.name = profile.getName();
                            user.email = profile.getEmail();
                            user.photoUrl = profile.getImageUrl();
                            user.firstName = profile.getGivenName();
                            user.lastName = profile.getFamilyName();
                            user.accessToken = token;
                            user.idToken = backendToken;
                            resolve(user);
                        }
                    });
                });
            });
        });
    }

    signIn(): Promise<SocialUser> {
        return new Promise((resolve, reject) => {
            let promise = this.auth2.signIn();

            promise.then(() => {
                let user: SocialUser = new SocialUser();
                let profile = this.auth2.currentUser.get().getBasicProfile();
                let token = this.auth2.currentUser.get().getAuthResponse(true).access_token;
                let backendToken = this.auth2.currentUser.get().getAuthResponse(true).id_token;

                user.socialUid = profile.getId();
                user.name = profile.getName();
                user.email = profile.getEmail();
                user.photoUrl = profile.getImageUrl();
                user.accessToken = token;
                user.idToken = backendToken;
                resolve(user);
            });
        });
    }

    signOut(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.auth2.signOut().then((err: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    revokeAuth(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.auth2.disconnect().then((err: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}
