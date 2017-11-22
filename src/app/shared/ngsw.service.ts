import { Injectable, Inject, PLATFORM_ID } from '@angular/core';

import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/startWith';


@Injectable()
export class NGSWService {
	private checkForUpdateSubj = new Subject();
	private checkInterval = 1000 * 60 * 60 * 6;   // 6 hours
	constructor(private swUpdate: SwUpdate, private snackBar: MatSnackBar){
		this.checkForUpdateSubj
			.debounceTime(this.checkInterval)
	        .startWith(null)
	        .subscribe(() => this.checkForUpdate());
	}

	ngOnInit(){

	    this.swUpdate.available.subscribe(event => {
	    	console.log(event)

	    	console.log('[App] Update available: current version is', event.current, 'available version is', event.available);
	    	let snackBarRef = this.snackBar.open('Newer version of the app is available', 'Refresh');

	    	snackBarRef.onAction().subscribe(() => {
	    		window.location.reload()
	    	});

	    });

	    this.swUpdate.activated.subscribe(event => {
	    	console.log(event)
	    	console.log('[App] Update activated: old version was', event.previous, 'new version is', event.current);
	    });

	}		

	checkForUpdate() {
		console.log('[App] checkForUpdate started')
		this.swUpdate.checkForUpdate()
		.then(() => {
			this.scheduleCheckForUpdate();
			console.log('[App] checkForUpdate completed')
		})
		.catch(err => {
			console.error(err);
		})
	}

	activateUpdate() {
		console.log('[App] activateUpdate started')
		this.swUpdate.activateUpdate()
		.then(() => {
			console.log('[App] activateUpdate completed')
	  	})
	  	.catch(err => {
	    	console.error(err);
	  	})
	}

	private scheduleCheckForUpdate(){
		this.checkForUpdateSubj.next();
	}
	
}
