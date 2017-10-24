import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { AppCommonModule } from './app.common.module';
import { SEOService } from './shared/seo.service';


@NgModule({
  imports: [
    AppCommonModule,
    NoopAnimationsModule,
    ServerModule
  ],
  bootstrap: [ AppComponent ],
  providers: [ SEOService ]
})
export class AppServerModule {}