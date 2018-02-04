import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BlogService } from './blog.service';

import { SEOService } from '../../shared/seo.service';

@Component({
    selector: 'app-blog',
    templateUrl: './blog.component.html',
})
export class BlogComponent implements OnInit, OnDestroy {
    destroy: Subject<any> = new Subject();
    keywords = 'angular, universal, angular-cli, PWA, expressjs';
    description = 'Blog page. It is a repository of articles.';

    constructor(public seoService: SEOService, blogService: BlogService) {
        this.seoService.setPageTitle('angular universal pwa - blog');
        this.seoService.setKeywordsAndDescription(this.keywords, this.description);
    }

    ngOnInit() {}

    ngOnDestroy() {
        this.destroy.next();
    }
}
