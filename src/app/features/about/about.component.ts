import { Component, OnInit } from '@angular/core';

import { SEOService } from '../../shared/seo.service';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html'
})

export class AboutComponent implements OnInit {
    keywords = 'angular, universal, angular-cli, PWA, expressjs';
    description = 'About page. It contains contact information.';

    constructor (public seoService: SEOService) {
        this.seoService.setPageTitle('ngiso - about');
        this.seoService.setKeywordsAndDescription(this.keywords, this.description);
    }

    ngOnInit() { }

}
