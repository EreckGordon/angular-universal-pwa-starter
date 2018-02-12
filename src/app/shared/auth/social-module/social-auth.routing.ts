/* tslint:disable: variable-name */
import { Routes } from '@angular/router';
import { SocialAuthSignInComponent } from './components/social-auth-sign-in.component';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: SocialAuthSignInComponent,
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
    },
];
