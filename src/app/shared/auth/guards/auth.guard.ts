import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';

import { map, tap } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor (public authService: AuthService, public router: Router) { }

    canActivate(): Observable<boolean> {
        return this.authService.user$.take(1).pipe(
            map(authState => !!authState),
            tap(authenticated => {
                if (!authenticated) {
                    this.router.navigate(['/']);
                }
            })
        );
    }
}
