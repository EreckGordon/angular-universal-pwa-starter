/* tslint:disable: variable-name */
import { Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in.component';
import { CreateAccountComponent } from './components/create-account.component';
import { RequestPasswordResetComponent } from './components/request-password-reset.component';
import { AccountManagementComponent } from './components/account-management/account-management.component';
import { AuthGuard } from './guards/auth.guard';


export const routes: Routes = [
    { path: 'sign-in', component: SignInComponent },
    { path: 'create-account', component: CreateAccountComponent },
    { path: 'request-password-reset', component: RequestPasswordResetComponent },
    { path: 'account', component: AccountManagementComponent, canActivate: [AuthGuard] }
];
