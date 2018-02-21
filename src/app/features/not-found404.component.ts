import { Component } from '@angular/core';
import { SEOService } from '../shared/seo.service';

@Component({
    selector: 'app-not-found',
    template: '<h3 class="center-everything">Error 404: Not found</h3>',
})
export class NotFound404Component {
    keywords = 'angular, universal, angular-cli, PWA, expressjs';
    description = 'This is the 404 page. You have entered an invalid url.';

    constructor(public seoService: SEOService) {
        this.seoService.setPageTitle('ngiso - 404');
        this.seoService.setKeywordsAndDescription(this.keywords, this.description);
    }
}
