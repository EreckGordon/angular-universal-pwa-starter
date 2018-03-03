import { Component, OnInit } from '@angular/core';

import { SEOService } from '../../shared/seo.service';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
})
export class AboutComponent implements OnInit {
    titleAndMetaTags = {
        title: 'Angular Universal PWA Starter - About',
        description: 'About page. It contains contact information.',
        url: 'https://universal-demo.ereckgordon.com/about',
    };

    constructor(public seoService: SEOService) {
        this.seoService.setTitleAndMetaTags(this.titleAndMetaTags);
    }

    ngOnInit() {}
}
