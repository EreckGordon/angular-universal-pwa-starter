import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { CustomMaterialModule } from '../../shared/custom-material-module/index';
import { JsonLdModule } from '@seo/json-ld.module';

import { HomeComponent } from './home.component';
import { HomeService } from './home.service';
import { routes } from './home.routing';

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes), CustomMaterialModule, ReactiveFormsModule, JsonLdModule],
    declarations: [HomeComponent],
    providers: [HomeService],
})
export class HomeModule {}
