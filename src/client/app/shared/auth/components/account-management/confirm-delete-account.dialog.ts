/* tslint:disable: component-class-suffix */
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
    selector: 'app-delete-account-dialog',
    template: `
        <div class="center-everything"><h4 mat-dialog-title>Permanently Delete your Account?</h4></div>

        <div class="center-everything"><p> Click yes to delete.</p></div><br>

        <div class="center-everything"><p>Hit <b>Esc</b> or <b>click outside this box</b> to cancel.</p></div><br>

        <mat-dialog-content>
            <div class="center-everything">
                <button mat-raised-button color="warn" (click)="dialogRef.close('Deleting Account')">Yes</button>
            </div>
        </mat-dialog-content>
    `,
})
export class ConfirmDeleteAccountDialog {
    constructor(public dialogRef: MatDialogRef<ConfirmDeleteAccountDialog>) {}
}
