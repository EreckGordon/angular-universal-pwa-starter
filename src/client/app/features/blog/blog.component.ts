import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { TitleAndMetaTags } from '@interfaces/title-and-meta-tags.interface';

import { BlogService } from './blog.service';
import { SEOService } from '@seo/seo.service';

@Component({
    selector: 'app-blog',
    templateUrl: './blog.component.html',
})
export class BlogComponent implements OnInit, OnDestroy {
    destroy: Subject<any> = new Subject();
    titleAndMetaTags = {
        title: 'Angular Universal PWA Starter - Blog',
        description: 'Blog page. It is a repository of articles.',
    };
    // prettier-ignore
    jsonLdSchema = {
        '@context': 'https://schema.org/'
    };

    constructor(private seoService: SEOService, blogService: BlogService) {
        this.seoService.setTitleAndMetaTags(this.titleAndMetaTags);
    }

    ngOnInit() {}

    ngOnDestroy() {
        this.destroy.next();
    }
}
