/* tslint:disable: variable-name */
import { Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in.component';
import { CreateAccountComponent } from './components/create-account.component';
import { RequestPasswordResetComponent } from './components/forgot-password/request-password-reset.component';
import { ResetPasswordComponent } from './components/forgot-password/reset-password.component';
import { AccountManagementComponent } from './components/account-management/account-management.component';
import { DeleteAccountComponent } from './components/account-management/delete-account.component';
import { AuthGuard } from './guards/auth.guard';

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
        component: AccountManagementComponent,
        canActivate: [AuthGuard],
    },
    { path: 'delete-account', component: DeleteAccountComponent },
    {
        path: 'social-sign-in',
        loadChildren: './social-module/social-auth.module#SocialAuthModule',
    },
];
