/* tslint:disable: variable-name */
import { Routes } from '@angular/router';
import { BlogComponent } from './blog.component';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: BlogComponent
            }
        ]
    }
];
