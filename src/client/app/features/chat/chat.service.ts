import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';
import { Observable, fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from '../../shared/auth/auth.service';

@Injectable()
export class ChatService {
    socket = io('http://localhost:8002/api/chat/gateway');
    recentlyCreatedAnon$;
    destroy = new Subject();

    constructor(private auth: AuthService) {
        this.auth.user$.subscribe(currentUser => {
            this.resetConnection();
            if (currentUser === null) {
            } else if (this.auth.isAuthenticatedUser(currentUser)) {
                this.recentlyCreatedAnon$ = fromEvent(this.socket, 'message')
                    .pipe(takeUntil(this.destroy))
                    .subscribe(res => console.log(res));
            }
        });
    }

    resetConnection() {
        this.destroy.next();
        this.socket.disconnect();
        this.socket.connect();
    }

    joinRoom(roomName) {
        this.socket.emit('join-chatroom', { roomName });
    }

    sendMessage(messageData: { roomName: string; message: string }) {
        this.socket.emit('message', messageData);
    }
}
