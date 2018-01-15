import { Component, OnInit, OnDestroy, Injector, PLATFORM_ID, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BlogService } from './blog.service';
import { isPlatformBrowser } from '@angular/common';

import { Observable } from 'rxjs/Observable';

import { SEOService } from '../../shared/seo.service';
import { AuthService } from '../../shared/auth.service';
import { AuthenticatedUser } from '../../shared/auth.service';

@Component({
    selector: 'app-blog',
    templateUrl: './blog.component.html'
})

export class BlogComponent implements OnInit, OnDestroy {
    destroy: Subject<any> = new Subject();
    keywords = 'angular, universal, angular-cli, PWA, expressjs';
    description = 'Blog page. It is a repository of articles.';
    authService: AuthService;
    auth$: Observable<AuthenticatedUser>;

    constructor (public seoService: SEOService, blogService: BlogService, private injector: Injector, @Inject(PLATFORM_ID) private platformId: Object) {
        this.seoService.setPageTitle('angular universal pwa - blog');
        this.seoService.setKeywordsAndDescription(this.keywords, this.description);
        if (isPlatformBrowser(this.platformId)) {
            this.authService = this.injector.get(AuthService);
            this.auth$ = this.authService.auth$;
        }

    }

    ngOnInit() { }


    ngOnDestroy() {
        this.destroy.next();
    }


}
