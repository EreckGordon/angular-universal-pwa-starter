/* tslint:disable: max-line-length */
import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { AboutComponent } from './features/about/about.component';
import { NotFound404Component } from './features/not-found404.component';
import { BlogModule } from './features/blog/blog.module';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'blog', loadChildren: './features/blog/blog.module#BlogModule' },
  { path: '**', component: NotFound404Component }
];
