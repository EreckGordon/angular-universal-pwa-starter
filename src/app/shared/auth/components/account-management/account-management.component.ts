import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog, MatDialogRef } from '@angular/material';

import { AuthService, AuthenticatedUser } from '../../auth.service';
import { ConfirmDeleteOwnAccountDialog } from './confirm-delete-own-account.dialog';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'app-account-management',
    templateUrl: './account-management.component.html'
})

export class AccountManagementComponent implements OnInit, OnDestroy {

    destroy: Subject<any> = new Subject();
    user: AuthenticatedUser;
    removeItemFromCartDialogRef: MatDialogRef<ConfirmDeleteOwnAccountDialog>;

    constructor (public auth: AuthService, private router: Router, public dialog: MatDialog, ) { }

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

    deleteOwnAccountDialog() {
        this.removeItemFromCartDialogRef = this.dialog.open(ConfirmDeleteOwnAccountDialog, {
            disableClose: false
        });

        this.removeItemFromCartDialogRef.afterClosed().take(1).subscribe(result => {

            if (result === 'Deleting Account') {
                this.deleteOwnAccount();
            };

        });
    }

    deleteOwnAccount() {
        this.auth.deleteOwnAccount();
    }

    ngOnDestroy() {
        this.destroy.next();
    }
}
