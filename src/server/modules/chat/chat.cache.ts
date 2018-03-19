import { Component } from '@nestjs/common';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';

@Component()
export class ChatCache {
    private chatReplaySubject: ReplaySubject<any> = new ReplaySubject(1);
    chatObservable: Observable<any> = this.chatReplaySubject.asObservable();

    addData(data) {
        this.chatReplaySubject.next(data);
    }
}
