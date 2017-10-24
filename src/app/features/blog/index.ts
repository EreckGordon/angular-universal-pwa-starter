import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './blog.routing';

import { BlogComponent } from './blog.component';
import { BlogService } from './blog.service';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    BlogComponent
  ],
  providers: [BlogService]
})

export class BlogModule {}

