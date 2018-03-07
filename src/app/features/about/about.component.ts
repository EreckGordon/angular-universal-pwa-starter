import { Component, OnInit } from '@angular/core';

import { TitleAndMetaTags } from '@interfaces/title-and-meta-tags.interface';

import { SEOService } from '@seo/seo.service';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
})
export class AboutComponent implements OnInit {
    titleAndMetaTags = {
        title: 'Angular Universal PWA Starter - About',
        description: 'About page. It contains contact information.',
    };
    // prettier-ignore
    jsonLdSchema = {
        "@context": "https://schema.org/",
        "@type": "WebPage",
        "description": "Design decisions may be found here"
    };

    constructor(private seoService: SEOService) {
        this.seoService.setTitleAndMetaTags(this.titleAndMetaTags);
    }

    ngOnInit() {}
}
