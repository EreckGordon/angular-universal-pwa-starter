import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppCommonModule } from './app.common.module';
import { SEOService } from './shared/seo.service';


@NgModule({
  imports: [
    AppCommonModule,
    NoopAnimationsModule,
    ServerTransferStateModule,
    ServerModule
  ],
  bootstrap: [ AppComponent ],
  providers: [ 
  	SEOService 
  ]
})
export class AppServerModule {}