import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

export interface AuthenticatedUser {
    id: string;
    isAnonymous: boolean;
    roles: string[];
    email: string | null;
}

@Injectable()
export class AuthService {
    private authSubject = new ReplaySubject<AuthenticatedUser | null>(1);
    auth$: Observable<AuthenticatedUser> = this.authSubject.asObservable();
    jsonHeaders: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    jsonOptions = { headers: this.jsonHeaders, withCredentials: true }

    constructor (private http: HttpClient) {
        console.log('auth service constructor')
        if (document.cookie.length > 0) {
            this.reauthenticate();
        }
        else {
            this.createAnonymousUser();
        }
    }

    private async reauthenticate() {
        this.http.post<AuthenticatedUser>('http://localhost:8000/auth/reauthenticate', {}, this.jsonOptions)
            .take(1).subscribe(user => this.authSubject.next(user), error => this.authSubject.next(null));
    }

    private async createAnonymousUser() {
        this.http.post<AuthenticatedUser>('http://localhost:8000/auth/create-anonymous-user', {}, this.jsonOptions)
            .take(1).subscribe(user => this.authSubject.next(user), error => this.authSubject.next(null));
    }

}
