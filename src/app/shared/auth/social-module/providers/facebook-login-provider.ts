import { BaseLoginProvider } from '../classes/base-login-provider.class';
import { SocialUser } from '../classes/social-user.class';
import { LoginOptions } from '../interfaces/login-options.interface';

declare let FB: any;

export class FacebookLoginProvider extends BaseLoginProvider {
    public static readonly PROVIDER_ID = 'facebook';

    constructor(
        private clientId: string,
        private opt: LoginOptions = { scope: 'email,public_profile' },
        private locale: string = 'en_US'
    ) {
        super();
    }

    initialize(): Promise<SocialUser> {
        console.log('initialize: facebook');
        return new Promise((resolve, reject) => {
            this.loadScript(
                FacebookLoginProvider.PROVIDER_ID,
                `//connect.facebook.net/${this.locale}/sdk.js`,
                () => {
                    FB.init({
                        appId: this.clientId,
                        autoLogAppEvents: true,
                        cookie: true,
                        xfbml: true,
                        version: 'v2.9',
                    });
                    // FB.AppEvents.logPageView(); #FIX for #18

                    FB.getLoginStatus(function(response: any) {
                        if (response.status === 'connected') {
                            let authResponse = response.authResponse;
                            FB.api(
                                '/me?fields=name,email,picture,first_name,last_name',
                                (fbUser: any) => {
                                    let user: SocialUser = new SocialUser();

                                    user.id = fbUser.id;
                                    user.name = fbUser.name;
                                    user.email = fbUser.email;
                                    user.photoUrl =
                                        'https://graph.facebook.com/' +
                                        fbUser.id +
                                        '/picture?type=normal';
                                    user.firstName = fbUser.first_name;
                                    user.lastName = fbUser.last_name;
                                    user.authToken = authResponse.accessToken;

                                    resolve(user);
                                }
                            );
                        }
                    });
                }
            );
        });
    }

    signIn(): Promise<SocialUser> {
        return new Promise((resolve, reject) => {
            FB.login((response: any) => {
                if (response.authResponse) {
                    let authResponse = response.authResponse;
                    FB.api('/me?fields=name,email,picture,first_name,last_name', (fbUser: any) => {
                        let user: SocialUser = new SocialUser();

                        user.id = fbUser.id;
                        user.name = fbUser.name;
                        user.email = fbUser.email;
                        user.photoUrl =
                            'https://graph.facebook.com/' + fbUser.id + '/picture?type=normal';
                        user.firstName = fbUser.first_name;
                        user.lastName = fbUser.last_name;
                        user.authToken = authResponse.accessToken;

                        resolve(user);
                    });
                }
            }, this.opt);
        });
    }

    signOut(): Promise<any> {
        return new Promise((resolve, reject) => {
            FB.logout((response: any) => {
                resolve();
            });
        });
    }
}
