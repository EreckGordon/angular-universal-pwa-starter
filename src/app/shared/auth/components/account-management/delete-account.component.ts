import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog, MatDialogRef } from '@angular/material';

import { AuthService } from '../../auth.service';
import { ConfirmDeleteAccountDialog } from './confirm-delete-account.dialog';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'app-delete-account',
    templateUrl: './delete-account.component.html'
})

export class DeleteAccountComponent implements OnInit, OnDestroy {

    destroy: Subject<any> = new Subject();
    deleteAccountDialogRef: MatDialogRef<ConfirmDeleteAccountDialog>;

    constructor (public auth: AuthService, private router: Router, public dialog: MatDialog) { }

    ngOnInit() {
        this.auth.user$.takeUntil(this.destroy).subscribe(user => {
            if ((user === null) || (this.auth.isAuthenticatedUser(user) && !user.email)) {
                return this.router.navigate(['/']);
            }
        });
    }

    deleteAccountDialog() {
        this.deleteAccountDialogRef = this.dialog.open(ConfirmDeleteAccountDialog, {
            disableClose: false
        });

        this.deleteAccountDialogRef.afterClosed().take(1).subscribe(result => {

            if (result === 'Deleting Account') {
                this.deleteAccount();
            }

        });
    }

    deleteAccount() {
        this.auth.deleteAccount();
    }

    ngOnDestroy() {
        this.destroy.next();
    }
}
