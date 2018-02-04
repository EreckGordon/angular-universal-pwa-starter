import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';

import { CustomMaterialModule } from '../custom-material-module/index';
import { SignInComponent } from './components/sign-in.component';
import { CreateAccountComponent } from './components/create-account.component';
import { RequestPasswordResetComponent } from './components/forgot-password/request-password-reset.component';
import { ResetPasswordComponent } from './components/forgot-password/reset-password.component';
import { AccountManagementComponent } from './components/account-management/account-management.component';
import { ChangePasswordComponent } from './components/account-management/change-password.component';
import { DeleteAccountComponent } from './components/account-management/delete-account.component';
import { ConfirmDeleteAccountDialog } from './components/account-management/confirm-delete-account.dialog';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './auth.service';
import { routes } from './auth.routing';
import { environment } from '../../../environments/environment';

const globalRecaptchaSettings: RecaptchaSettings = { siteKey: environment.recaptchaSiteKey };

@NgModule({
    declarations: [
        SignInComponent,
        CreateAccountComponent,
        RequestPasswordResetComponent,
        ResetPasswordComponent,
        AccountManagementComponent,
        ChangePasswordComponent,
        DeleteAccountComponent,
        ConfirmDeleteAccountDialog
    ],
    imports: [
        CommonModule,
        CustomMaterialModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        RecaptchaModule.forRoot(),
        RecaptchaFormsModule
    ],
    providers: [
        AuthGuard,
        AuthService,
        {
            provide: RECAPTCHA_SETTINGS,
            useValue: globalRecaptchaSettings
        }
    ],
    entryComponents: [ConfirmDeleteAccountDialog]
})

export class AuthModule { }
