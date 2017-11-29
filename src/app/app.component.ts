import { Component, Injector, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

import { views } from './app-nav-views';
import { NGSWUpdateService } from './shared/ngsw-update.service';
import { environment } from '../environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
	views = views;
	worker:NGSWUpdateService;

	constructor(public router: Router, private injector:Injector, @Inject(PLATFORM_ID) private platformId: Object){
		if (isPlatformBrowser(this.platformId) && environment.production){
			this.worker = this.injector.get(NGSWUpdateService)
		}
	}

}
