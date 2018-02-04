import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './about.routing';

import { AboutComponent } from './about.component';
import { AboutService } from './about.service';

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    declarations: [AboutComponent],
    providers: [AboutService],
})
export class AboutModule {}
