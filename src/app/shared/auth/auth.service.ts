import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { MatSnackBar } from '@angular/material';

import { environment } from '../../../environments/environment';

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

export type UserOrError = AuthenticatedUser | HttpErrorResponse | null;

@Injectable()
export class AuthService {
    private userSubject = new ReplaySubject<UserOrError>(1);
    user$: Observable<UserOrError> = this.userSubject.asObservable();
    private jsonHeaders: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
    });
    private jsonOptions = { headers: this.jsonHeaders, withCredentials: true };

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object,
        private snackbar: MatSnackBar
    ) {
        if (isPlatformBrowser(this.platformId)) {
            document.cookie.length > 0 ? this.reauthenticate() : this.userSubject.next(null);
        } else {
            this.userSubject.next(null);
        }
    }

    private reauthenticate(): void {
        this.http
            .post<AuthenticatedUser>(
                `${environment.baseUrl}/api/auth/reauthenticate`,
                {},
                this.jsonOptions
            )
            .take(1)
            .subscribe(user => this.userSubject.next(user), error => this.userSubject.next(null));
    }

    // use this function when you need to pre-load their basic database access
    createAnonymousUser(): void {
        this.http
            .post<AuthenticatedUser>(
                `${environment.baseUrl}/api/auth/create-anonymous-user`,
                {},
                this.jsonOptions
            )
            .take(1)
            .subscribe(user => this.userSubject.next(user), error => this.userSubject.next(null));
    }

    // use this function when offering to create an account after entering their email
    upgradeAnonymousUserToEmailAndPasswordUser({ email, password }: EmailAndPassword): void {
        this.http
            .patch<AuthenticatedUser>(
                `${environment.baseUrl}/api/auth/upgrade-anonymous-user-to-email-and-password`,
                { email, password },
                this.jsonOptions
            )
            .take(1)
            .subscribe(
                user => this.userSubject.next(user),
                error => this.assignErrorToUserSubject(error)
            );
    }

    createEmailAndPasswordUser({ email, password }: EmailAndPassword): void {
        this.http
            .post<AuthenticatedUser>(
                `${environment.baseUrl}/api/auth/create-email-and-password-user`,
                { email, password },
                this.jsonOptions
            )
            .take(1)
            .subscribe(
                user => this.userSubject.next(user),
                error => this.assignErrorToUserSubject(error)
            );
    }

    loginWithEmailAndPassword({ email, password }: EmailAndPassword): void {
        this.http
            .post<AuthenticatedUser>(
                `${environment.baseUrl}/api/auth/login-email-and-password-user`,
                { email, password },
                this.jsonOptions
            )
            .take(1)
            .subscribe(
                user => this.userSubject.next(user),
                error => this.assignErrorToUserSubject(error)
            );
    }

    requestPasswordReset({ email }: { email: string }): void {
        this.http
            .post(
                `${environment.baseUrl}/api/auth/request-password-reset`,
                { email },
                this.jsonOptions
            )
            .take(1)
            .subscribe(
                () =>
                    this.snackbar.open(`Password Reset Requested`, `OK`, {
                        duration: 20000,
                    }),
                error => this.assignErrorToUserSubject(error)
            );
    }

    resetPassword({ password, token }: { password: string; token: string }): void {
        this.http
            .post<AuthenticatedUser>(
                `${environment.baseUrl}/api/auth/reset-password`,
                { password, token },
                this.jsonOptions
            )
            .take(1)
            .subscribe(
                user => this.userSubject.next(user),
                error => this.assignErrorToUserSubject(error)
            );
    }

    changePassword({
        oldPassword,
        newPassword,
    }: {
        oldPassword: string;
        newPassword: string;
    }): Observable<Object> {
        return this.http.post(
            `${environment.baseUrl}/api/auth/change-password`,
            { oldPassword, newPassword },
            this.jsonOptions
        );
    }

    signInWithSocialProvider(provider: string) {
        console.log(provider)
    }

    logout(): void {
        this.http
            .post(`${environment.baseUrl}/api/auth/logout`, {}, this.jsonOptions)
            .take(1)
            .subscribe(() => this.userSubject.next(null), error => console.log(error));
    }

    deleteAccount() {
        this.http
            .post(`${environment.baseUrl}/api/auth/delete-account`, {}, this.jsonOptions)
            .take(1)
            .subscribe(() => this.userSubject.next(null), error => console.log(error));
    }

    // used to clear error message manually after the component has performed its localized error logic
    errorHandled() {
        this.userSubject.next(null);
    }

    private assignErrorToUserSubject(error: HttpErrorResponse) {
        this.userSubject.next(error);
    }

    isAuthenticatedUser(user: AuthenticatedUser | HttpErrorResponse): user is AuthenticatedUser {
        return (<AuthenticatedUser>user).id !== undefined;
    }

    isHttpErrorResponse(user: AuthenticatedUser | HttpErrorResponse): user is HttpErrorResponse {
        return (<HttpErrorResponse>user).error !== undefined;
    }
}
