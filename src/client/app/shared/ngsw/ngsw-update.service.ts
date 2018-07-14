import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material';

import { Subject } from 'rxjs';
import { debounceTime, startWith, take } from 'rxjs/operators';

@Injectable()
export class NGSWUpdateService {
    private checkForUpdateSubj = new Subject();
    private checkInterval = 1000 * 60 * 60 * 6; // 6 hours
    constructor(private swUpdate: SwUpdate, private snackBar: MatSnackBar) {
        this.swUpdate.available.subscribe(event => this.reloadPrompt());
        this.checkForUpdateSubj
            .pipe(
                debounceTime(this.checkInterval),
                startWith(null)
            )
            .subscribe(() => this.checkForUpdate());
    }

    private checkForUpdate() {
        this.swUpdate
            .checkForUpdate()
            .then(() => this.scheduleCheckForUpdate())
            .catch(err => console.error(err));
    }

    private activateUpdate() {
        this.swUpdate
            .activateUpdate()
            .then(() => this.reloadPrompt())
            .catch(err => console.error(err));
    }

    private scheduleCheckForUpdate() {
        this.checkForUpdateSubj.next();
    }

    private reloadPrompt() {
        this.snackBar
            .open('Updated Content Available, Press OK to Reload', 'OK')
            .afterDismissed()
            .pipe(take(1))
            .subscribe(() => window.location.reload());
    }
}
