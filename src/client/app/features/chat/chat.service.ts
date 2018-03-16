import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';

import { AuthenticatedUser } from '@interfaces/authenticated-user.interface';

import { AuthService } from '../../shared/auth/auth.service';

@Injectable()
export class ChatService {
    private userState: AuthenticatedUser = { email: '', id: '', roles: [''], authProviders: [''], isAnonymous: true };
    socket = io('http://localhost:8001/api/auth/gateway');
    recentlyCreatedAnon$;

    constructor(private auth: AuthService) {
        console.log('hi');
        this.auth.user$.subscribe(currentUser => {
            if (currentUser === null) {
            } else if (this.auth.isAuthenticatedUser(currentUser)) {
                this.userState = currentUser;
            }
        });
        this.recentlyCreatedAnon$ = fromEvent(this.socket, 'recently-created-anon').subscribe(console.log);
    }

    get uuid() {
        return this.userState.id;
    }

    emit() {
        this.socket.emit('recently-created-anon', { uuid: this.uuid });
    }
}
