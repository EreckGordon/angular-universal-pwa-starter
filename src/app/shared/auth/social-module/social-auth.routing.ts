/* tslint:disable: variable-name */
import { Routes } from '@angular/router';
import { SocialAuthSignInComponent } from './social-auth-sign-in.component';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: ':socialProvider',
                component: SocialAuthSignInComponent,
            },
        ],
    },
];
