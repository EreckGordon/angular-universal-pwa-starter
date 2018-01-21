import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'app-account-management',
    templateUrl: './account-management.component.html'
})

export class AccountManagementComponent implements OnInit, OnDestroy {

    destroy: Subject<any> = new Subject();

    constructor (public auth: AuthService, private router: Router) { }

    ngOnInit() {
        this.auth.user$.takeUntil(this.destroy).subscribe(user => {
            console.log(user)
        })
    }

    ngOnDestroy() {
        this.destroy.next();
    }
}
