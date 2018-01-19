import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { CustomMaterialModule } from '../custom-material-module/index';

import { SignInComponent } from './components/sign-in';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';


@NgModule({
    declarations: [
        SignInComponent
    ],
    imports: [
        CommonModule,
        CustomMaterialModule,
        ReactiveFormsModule,
        RouterModule.forChild([])
    ],
    providers: [
        AuthGuard,
        AuthService
    ],
    exports: [
        SignInComponent
    ]
})

export class AuthModule { }
