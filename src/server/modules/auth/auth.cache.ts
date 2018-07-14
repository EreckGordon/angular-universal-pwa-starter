import { Injectable } from '@nestjs/common';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthCache {
    private wsReplaySubject: ReplaySubject<any> = new ReplaySubject(1);
    wsObservable: Observable<any> = this.wsReplaySubject.asObservable();

    addData(data) {
        this.wsReplaySubject.next(data);
    }
}
