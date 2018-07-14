import { Injectable } from '@nestjs/common';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable()
export class AuthCache {
    private wsReplaySubject: ReplaySubject<any> = new ReplaySubject(1);
    wsObservable: Observable<any> = this.wsReplaySubject.asObservable();

    addData(data) {
        this.wsReplaySubject.next(data);
    }
}
