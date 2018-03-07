import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { TitleAndMetaTags } from '@interfaces/title-and-meta-tags.interface';

import { SEOService } from '@seo/seo.service';
import { AuthService, UserOrError } from '../../shared/auth/auth.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
    titleAndMetaTags: TitleAndMetaTags = {
        title: 'Angular Universal PWA Starter',
        description: 'Angular Universal PWA, built with NestJS and TypeORM.',
    };
    // prettier-ignore
    jsonLdSchema = {
        "@context": "https://schema.org/",
        "@type": "WebSite",
        "keywords": "angular universal, angular cli, angular service worker, nestjs, typeorm, postgres",
        "name": "Angular Universal PWA Demo Page"
    };
    user$: Observable<UserOrError>;

    constructor(private seoService: SEOService, public authService: AuthService) {
        this.seoService.setTitleAndMetaTags(this.titleAndMetaTags);
        this.user$ = authService.user$;
    }

    ngOnInit() {}

    createAnonymousUser() {
        this.authService.createAnonymousUser();
    }

}
