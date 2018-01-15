import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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

    constructor (private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
        if (isPlatformBrowser(this.platformId)) {
            document.cookie.length > 0 ? this.reauthenticate() : this.createAnonymousUser();
        }
        else {
            this.authSubject.next(null)
        }
    }

    private reauthenticate(): void {
        this.http.post<AuthenticatedUser>('http://localhost:8000/auth/reauthenticate', {}, this.jsonOptions)
            .take(1).subscribe(user => this.authSubject.next(user), error => this.authSubject.next(null));
    }

    private createAnonymousUser(): void {
        this.http.post<AuthenticatedUser>('http://localhost:8000/auth/create-anonymous-user', {}, this.jsonOptions)
            .take(1).subscribe(user => this.authSubject.next(user), error => this.authSubject.next(null));
    }

}
