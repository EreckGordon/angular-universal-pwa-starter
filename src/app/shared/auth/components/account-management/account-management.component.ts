import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, AuthenticatedUser } from '../../auth.service';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'app-account-management',
    templateUrl: './account-management.component.html'
})

export class AccountManagementComponent implements OnInit, OnDestroy {

    destroy: Subject<any> = new Subject();
    user: AuthenticatedUser;
    showChangePassword: boolean = false;

    constructor (public auth: AuthService, public router: Router, ) { }

    ngOnInit() {
        this.auth.user$.takeUntil(this.destroy).subscribe(user => {
            if ((user === null) || (this.auth.isAuthenticatedUser(user) && !user.email)) {
                return this.router.navigate(['/']);
            }
            if (this.auth.isAuthenticatedUser(user)) this.user = user;
        })
    }

    logout() {
        this.auth.logout();
    }

    toggleShowChangePassword() {
        this.showChangePassword = !this.showChangePassword;
    }

    ngOnDestroy() {
        this.destroy.next();
    }
}
