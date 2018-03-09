/* tslint:disable: variable-name */
import { Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in.component';
import { CreateAccountComponent } from './components/create-account.component';
import { RequestPasswordResetComponent } from './components/forgot-password/request-password-reset.component';
import { ResetPasswordComponent } from './components/forgot-password/reset-password.component';
import { AccountManagementComponent } from './components/account-management/account-management.component';
import { DeleteAccountComponent } from './components/account-management/delete-account.component';
import { AuthGuard } from './guards/auth.guard';
import { LinkEmailAndPasswordToAccountComponent } from './components/account-management/link-email-and-password-to-account.component';

export const routes: Routes = [
    { path: 'sign-in', component: SignInComponent },
    { path: 'create-account', component: CreateAccountComponent },
    {
        path: 'request-password-reset',
        component: RequestPasswordResetComponent,
    },
    { path: 'reset-password', component: ResetPasswordComponent },
    {
        path: 'account',
        children: [
            {
                path: '',
                component: AccountManagementComponent,
            },
            {
                path: 'delete-account',
                component: DeleteAccountComponent,
            },
            {
                path: 'link-email-and-password',
                component: LinkEmailAndPasswordToAccountComponent,
            },
            {
                path: 'social',
                loadChildren: './social-module/social-auth.module#SocialAuthModule',
            },
        ],
        canActivate: [AuthGuard],
    },
    {
        path: 'social-sign-in',
        loadChildren: './social-module/social-auth.module#SocialAuthModule',
    },
];
