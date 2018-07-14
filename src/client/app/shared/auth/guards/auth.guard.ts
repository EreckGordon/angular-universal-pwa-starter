import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

import { map, tap, take } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(public authService: AuthService, public router: Router) {}

    canActivate(): Observable<boolean> {
        return this.authService.user$.pipe(
            map(authState => !!authState),
            tap(authenticated => {
                if (!authenticated) {
                    this.router.navigate(['/sign-in']);
                }
            }),
            take(1)
        );
    }
}
