import { Component, Injector, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { environment } from '../environments/environment';
import { views } from './app-nav-views';
import { NGSWUpdateService } from '@services/ngsw-update.service';
import { AuthService, UserOrError } from './shared/auth/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    views = views;
    worker: NGSWUpdateService;
    user$: Observable<UserOrError>;

    constructor(
        public router: Router,
        private injector: Injector,
        @Inject(PLATFORM_ID) private platformId: Object,
        public auth: AuthService
    ) {
        if (isPlatformBrowser(this.platformId) && environment.production) {
            this.worker = this.injector.get(NGSWUpdateService);
        }
        this.user$ = auth.user$;
    }
}
