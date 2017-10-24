import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppCommonModule } from './app.common.module';
import { SEOService } from './shared/seo.service';


@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    AppCommonModule   
  ],
  providers: [ SEOService ]
})
export class AppModule { }
