import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

import { NgServiceWorker } from '@angular/service-worker';
import { MdSnackBar } from '@angular/material'

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/startWith';

import { views } from './app-nav-views';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ NgServiceWorker ]
})
export class AppComponent {
	views = views;
	private checkForUpdateSubj = new Subject();
	private checkInterval = 1000 * 60 * 60 * 6;   // 6 hours

	constructor(public router: Router, public worker: NgServiceWorker, private snackBar: MdSnackBar, @Inject(PLATFORM_ID) private platformId: Object){
		this.checkForUpdateSubj
			.debounceTime(this.checkInterval)
	        .startWith(null)
	        .subscribe(() => this.checkForUpdate());
	}

	ngOnInit(){
		if (isPlatformBrowser(this.platformId)){
			this.worker.updates.subscribe(res => {
				res.type === 'activation' ? this.reloadPrompt() : null;
			});
		}
	}

	private checkForUpdate(){
		this.worker.checkForUpdate()
			.concat(Observable.of(false)).take(1)
    		.do(v => console.log('service worker update check: new content?', v))
    		.subscribe(v => v ? this.activateUpdate() : this.scheduleCheckForUpdate());		
	}

	private activateUpdate(){
		this.worker.activateUpdate(null)
			.subscribe(() => console.log('Service Worker updated. Fresh content will be served upon next page reload.'))
	}

	private scheduleCheckForUpdate(){
		this.checkForUpdateSubj.next();
	}	

	private reloadPrompt(){
		this.snackBar.open('Updated Content Available, Press OK to Reload','OK')
			.afterDismissed().take(1).subscribe(() => window.location.reload());		
	}

}
