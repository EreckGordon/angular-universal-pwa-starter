import { Component } from '@angular/core';

import { TitleAndMetaTags } from '@interfaces/title-and-meta-tags.interface';

import { SEOService } from '@seo/seo.service';

@Component({
    selector: 'app-not-found',
    template: `
        <json-ld [json]="jsonLdSchema"></json-ld>
        <h3 class="center-everything">Error 404: Not found</h3>
    `,
})
export class NotFound404Component {
    titleAndMetaTags = {
        title: 'Angular Universal PWA Starter - 404',
        description: 'This is the 404 page. You have entered an invalid url.',
        url: 'https://universal-demo.ereckgordon.com/404',
    };
    // prettier-ignore
    jsonLdSchema = {
        '@context': 'https://schema.org/'
    };

    constructor(private seoService: SEOService) {
        this.seoService.setTitleAndMetaTags(this.titleAndMetaTags);
    }
}
