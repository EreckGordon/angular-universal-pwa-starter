/* tslint:disable: variable-name */
import { Routes } from '@angular/router';
import { ChatComponent } from './chat.component';
import { AuthGuard } from '../../shared/auth/guards/auth.guard';
import { ChatroomComponent } from './chatroom.component';

export const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                component: ChatComponent,
                children: [
                    {
                        path: ':roomName',
                        component: ChatroomComponent,
                    },
                ],
            },
        ],
    },
];
