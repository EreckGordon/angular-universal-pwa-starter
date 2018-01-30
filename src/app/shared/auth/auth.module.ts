import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { CustomMaterialModule } from '../custom-material-module/index';

import { SignInComponent } from './components/sign-in.component';
import { CreateAccountComponent } from './components/create-account.component';
import { RequestPasswordResetComponent } from './components/forgot-password/request-password-reset.component';
import { ResetPasswordComponent } from './components/forgot-password/reset-password.component';
import { AccountManagementComponent } from './components/account-management/account-management.component';
import { ConfirmDeleteOwnAccountDialog } from './components/account-management/confirm-delete-own-account.dialog';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './auth.service';
import { routes } from './auth.routing';


@NgModule({
    declarations: [
        SignInComponent,
        CreateAccountComponent,
        RequestPasswordResetComponent,
        ResetPasswordComponent,
        AccountManagementComponent,
        ConfirmDeleteOwnAccountDialog
    ],
    imports: [
        CommonModule,
        CustomMaterialModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ],
    providers: [
        AuthGuard,
        AuthService
    ],
    entryComponents: [ConfirmDeleteOwnAccountDialog]
})

export class AuthModule { }
