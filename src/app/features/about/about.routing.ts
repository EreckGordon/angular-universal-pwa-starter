/* tslint:disable: variable-name */
import { Routes } from '@angular/router';
import { AboutComponent } from './about.component';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: AboutComponent
            }
        ]
    }
];
