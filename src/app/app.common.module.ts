import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { CustomMaterialModule } from './shared/custom-material-module/index';

import { routes } from './app.routing';
import { NotFound404Component } from './features/not-found404.component';



@NgModule({
    declarations: [
        NotFound404Component
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'angular-universal-pwa-starter' }),
        CustomMaterialModule,
        ReactiveFormsModule,
        HttpClientModule,
        HttpClientXsrfModule.withOptions({
            cookieName: 'XSRF-TOKEN',
            headerName: 'x-xsrf-token'
        }),
        RouterModule.forRoot(routes, { useHash: false, initialNavigation: 'enabled' })
    ],
    providers: [],
    bootstrap: [],
    exports: [
        CustomMaterialModule,
        RouterModule
    ]
})
export class AppCommonModule { }
