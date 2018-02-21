/* tslint:disable: variable-name */
import { Routes } from '@angular/router';
import { SocialAuthSignInComponent } from './components/social-auth-sign-in.component';
import { LinkSocialToAccountComponent } from './components/link-social-to-account.component';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: SocialAuthSignInComponent,
            },
            {
                path: 'link-social-to-account',
                component: LinkSocialToAccountComponent,
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
    },
];
