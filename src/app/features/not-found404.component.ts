import { Component } from '@angular/core';
import { SEOService } from '../shared/seo.service';

@Component({
  selector: 'my-not-found',
  template: '<h3>Error 404: Not found</h3>'
})

export class NotFound404Component {
	keywords: string = 'angular, universal, angular-cli, PWA, expressjs';
	description: string = 'This is the 404 page. You have entered an invalid url.';

    constructor(public seoService:SEOService) {
    	this.seoService.setPageTitle('ngiso - 404');
    	this.seoService.setKeywordsAndDescription(this.keywords, this.description);
    }	
}
