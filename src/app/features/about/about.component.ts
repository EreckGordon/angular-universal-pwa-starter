import { Component, OnInit, Injector, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { SEOService } from '../../shared/seo.service';
import { AuthService } from '../../shared/auth.service';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html'
})

export class AboutComponent implements OnInit {
    keywords = 'angular, universal, angular-cli, PWA, expressjs';
    description = 'About page. It contains contact information.';
    authService: AuthService;

    constructor (public seoService: SEOService, private injector: Injector, @Inject(PLATFORM_ID) private platformId: Object) {
        this.seoService.setPageTitle('angular universal pwa - about');
        this.seoService.setKeywordsAndDescription(this.keywords, this.description);
        if (isPlatformBrowser(this.platformId)) {
            this.authService = this.injector.get(AuthService);
        }

    }

    ngOnInit() { }

}
