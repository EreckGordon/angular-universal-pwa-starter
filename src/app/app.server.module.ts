import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';

import { AppComponent } from './app.component';
import { AppCommonModule } from './app.common.module';
import { SEOService } from './shared/seo.service';

@NgModule({
    imports: [
        AppCommonModule,
        NoopAnimationsModule,
        ServerTransferStateModule,
        ServerModule,
        ModuleMapLoaderModule,
    ],
    bootstrap: [AppComponent],
    providers: [SEOService],
})
export class AppServerModule {}
