/* tslint:disable: variable-name */
import { Routes } from '@angular/router';
import { ChatComponent } from './chat.component';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: ChatComponent,
            },
        ],
    },
];
