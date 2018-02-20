import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './home.routing';
import { CustomMaterialModule } from '../../shared/custom-material-module/index';
import { ReactiveFormsModule } from '@angular/forms';

import { HomeComponent } from './home.component';
import { HomeService } from './home.service';

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes), CustomMaterialModule, ReactiveFormsModule],
    declarations: [HomeComponent],
    providers: [HomeService],
})
export class HomeModule {}
