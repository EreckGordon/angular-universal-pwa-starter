import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild([])
    ],
    providers: [
        AuthGuard,
        AuthService
    ]
})

export class AuthModule { }
