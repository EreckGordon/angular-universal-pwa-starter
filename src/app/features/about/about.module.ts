import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './about.routing';

import { JsonLdModule } from '@seo/json-ld.module';

import { AboutComponent } from './about.component';
import { AboutService } from './about.service';

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes), JsonLdModule],
    declarations: [AboutComponent],
    providers: [AboutService],
})
export class AboutModule {}
