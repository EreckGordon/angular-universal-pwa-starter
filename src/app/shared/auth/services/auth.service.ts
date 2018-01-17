import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { environment } from '../../../../environments/environment';

export interface AuthenticatedUser {
    id: string;
    isAnonymous: boolean;
    roles: string[];
    email: string | null;
}

interface EmailAndPassword {
    email: string;
    password: string;
}


@Injectable()
export class AuthService {
    private userSubject = new ReplaySubject<AuthenticatedUser | null>(1);
    user$: Observable<AuthenticatedUser> = this.userSubject.asObservable();
    private jsonHeaders: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    private jsonOptions = { headers: this.jsonHeaders, withCredentials: true };

    constructor (private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
        if (isPlatformBrowser(this.platformId)) {
            document.cookie.length > 0 ? this.reauthenticate() : this.createAnonymousUser();
        }
        else {
            this.userSubject.next(null)
        }
    }

    private reauthenticate(): void {
        this.http.post<AuthenticatedUser>(`${environment.baseUrl}/auth/reauthenticate`, {}, this.jsonOptions)
            .take(1).subscribe(user => this.userSubject.next(user), error => this.userSubject.next(null));
    }

    createAnonymousUser(): void {
        this.http.post<AuthenticatedUser>(`${environment.baseUrl}/auth/create-anonymous-user`, {}, this.jsonOptions)
            .take(1).subscribe(user => this.userSubject.next(user), error => this.userSubject.next(null));
    }

    upgradeAnonymousUserToEmailAndPasswordUser({ email, password }: EmailAndPassword): void {
        this.http.patch<AuthenticatedUser>(`${environment.baseUrl}/auth/upgrade-anonymous-user-to-email-and-password`, { email, password }, this.jsonOptions)
            .take(1).subscribe(user => this.userSubject.next(user), error => this.userSubject.next(null));
    }

    createEmailAndPasswordUser({ email, password }: EmailAndPassword): void {
        this.http.post<AuthenticatedUser>(`${environment.baseUrl}/auth/create-email-and-password-user`, { email, password }, this.jsonOptions)
            .take(1).subscribe(user => this.userSubject.next(user), error => this.userSubject.next(null));
    }

    loginWithEmailAndPassword({ email, password }: EmailAndPassword): void {
        this.http.post<AuthenticatedUser>(`${environment.baseUrl}/auth/login-email-and-password-user`, { email, password }, this.jsonOptions)
            .take(1).subscribe(user => this.userSubject.next(user), error => this.userSubject.next(null));
    }

    logout(): void {
        this.http.post(`${environment.baseUrl}/auth/logout`, {}, this.jsonOptions)
            .take(1).subscribe(user => this.userSubject.next(null), error => console.log(error));
    }

}
