import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subject } from 'rxjs/Subject';

import { AuthService } from '../../shared/auth/auth.service';

@Injectable()
export class ChatService {
    socket = io('http://localhost:8001/api/auth/gateway');
    recentlyCreatedAnon$;
    destroy = new Subject();

    constructor(private auth: AuthService) {
        this.auth.user$.subscribe(currentUser => {
            this.resetConnection();
            if (currentUser === null) {
            } else if (this.auth.isAuthenticatedUser(currentUser)) {
                this.recentlyCreatedAnon$ = fromEvent(this.socket, 'recently-created-anon')
                    .takeUntil(this.destroy)
                    .subscribe(console.log);
            }
        });
    }

    resetConnection() {
        this.destroy.next();
        this.socket.disconnect();
        this.socket.connect();
    }

    emit() {
        this.socket.emit('recently-created-anon');
    }
}
