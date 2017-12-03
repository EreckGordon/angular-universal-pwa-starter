import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserTransferStateModule } from '@angular/platform-browser';

import { TransferHttpCacheModule } from '@nguniversal/common';

import { AppComponent } from './app.component';
import { AppCommonModule } from './app.common.module';
import { SEOService } from './shared/seo.service';
import { NGSWUpdateService } from './shared/ngsw-update.service';
import { environment } from '../environments/environment';

@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserAnimationsModule,
        AppCommonModule,
        BrowserTransferStateModule,
        TransferHttpCacheModule,
        environment.production ? ServiceWorkerModule.register('/ngsw-worker.js') : []
    ],
    providers: [
        SEOService,
        NGSWUpdateService
    ]
})
export class AppBrowserModule { }
