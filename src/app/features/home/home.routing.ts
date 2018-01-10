/* tslint:disable: variable-name */
import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: HomeComponent
            }
        ]
    }
];
