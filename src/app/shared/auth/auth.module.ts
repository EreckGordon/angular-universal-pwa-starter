import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { CustomMaterialModule } from '../custom-material-module/index';

import { SignInComponent } from './components/sign-in.component';
import { CreateAccountComponent } from './components/create-account.component';
import { RequestPasswordResetComponent } from './components/request-password-reset.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { routes } from './auth.routing';


@NgModule({
    declarations: [
        SignInComponent,
        CreateAccountComponent,
        RequestPasswordResetComponent
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
    ]
})

export class AuthModule { }
