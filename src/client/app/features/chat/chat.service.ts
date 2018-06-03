import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subject } from 'rxjs/Subject';

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
                    .takeUntil(this.destroy)
                    .subscribe(res=>console.log(res));
            }
        });
    }

    resetConnection() {
        this.destroy.next();
        this.socket.disconnect();
        this.socket.connect();
    }

    emit() {
        this.socket.emit('join-chatroom', {roomName: 'room1'});
        
    }
    emit2(){
        this.socket.emit('message', {roomName: 'room1', message: 'hi'})
        //this.socket.emit('message', {roomName: 'test2', message: 'hi2'})
    }
}
