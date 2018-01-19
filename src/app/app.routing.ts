/* tslint:disable: max-line-length */
import { Routes } from '@angular/router';
import { NotFound404Component } from './features/not-found404.component';
import { SignInComponent } from './shared/auth/components/sign-in';


export const routes: Routes = [
    { path: '', loadChildren: './features/home/home.module#HomeModule' },
    { path: 'about', loadChildren: './features/about/about.module#AboutModule' },
    { path: 'blog', loadChildren: './features/blog/blog.module#BlogModule' },
    { path: 'sign-in', component: SignInComponent },
    { path: '**', component: NotFound404Component }
];
