import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { CustomMaterialModule } from './shared/custom-material-module/index';
import { AuthModule } from './shared/auth/auth.module';
import { JsonLdModule } from '@seo/json-ld.module';

import { HttpXsrfInterceptor } from './interceptors/http-xsrf.interceptor';
import { routes } from './app.routing';
import { NotFound404Component } from './features/not-found404.component';

@NgModule({
    declarations: [NotFound404Component],
    imports: [
        BrowserModule.withServerTransition({
            appId: 'angular-universal-pwa-starter',
        }),
        CustomMaterialModule,
        ReactiveFormsModule,
        HttpClientModule,
        HttpClientXsrfModule.withOptions({
            cookieName: 'XSRF-TOKEN',
            headerName: 'x-xsrf-token',
        }),
        RouterModule.forRoot(routes, {
            useHash: false,
            initialNavigation: 'enabled',
        }),
        AuthModule,
        JsonLdModule,
    ],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: HttpXsrfInterceptor, multi: true }],
    bootstrap: [],
    exports: [CustomMaterialModule, RouterModule, JsonLdModule],
})
export class AppCommonModule {}
