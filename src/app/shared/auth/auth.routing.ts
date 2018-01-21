/* tslint:disable: variable-name */
import { Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in.component';
import { CreateAccountComponent } from './components/create-account.component';
import { RequestPasswordResetComponent } from './components/request-password-reset.component';


export const routes: Routes = [
    { path: 'sign-in', component: SignInComponent },
    { path: 'create-account', component: CreateAccountComponent },
    { path: 'reset-password', component: RequestPasswordResetComponent },
];
