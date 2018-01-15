import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BlogService } from './blog.service';

import { Observable } from 'rxjs/Observable';

import { SEOService } from '../../shared/seo.service';
import { AuthService } from '../../shared/auth/services/auth.service';
import { AuthenticatedUser } from '../../shared/auth/services/auth.service';

@Component({
    selector: 'app-blog',
    templateUrl: './blog.component.html'
})

export class BlogComponent implements OnInit, OnDestroy {
    destroy: Subject<any> = new Subject();
    keywords = 'angular, universal, angular-cli, PWA, expressjs';
    description = 'Blog page. It is a repository of articles.';
    auth$: Observable<AuthenticatedUser>;

    constructor (public seoService: SEOService, blogService: BlogService, authService: AuthService) {
        this.seoService.setPageTitle('angular universal pwa - blog');
        this.seoService.setKeywordsAndDescription(this.keywords, this.description);
        this.auth$ = authService.auth$;
    }

    ngOnInit() { }


    ngOnDestroy() {
        this.destroy.next();
    }


}
