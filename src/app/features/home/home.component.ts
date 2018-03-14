import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

import { TitleAndMetaTags } from '@interfaces/title-and-meta-tags.interface';

import { SEOService } from '@seo/seo.service';
import { AuthService, UserOrError } from '../../shared/auth/auth.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
    titleAndMetaTags: TitleAndMetaTags = {
        title: 'Angular Universal PWA Starter',
        description: 'Angular Universal PWA, built with NestJS and TypeORM.',
    };
    // prettier-ignore
    jsonLdSchema = {
        '@context': 'https://schema.org/'
    };
    user$: Observable<UserOrError>;
    destroy = new Subject();

    constructor(private seoService: SEOService, private http: HttpClient, public authService: AuthService) {
        this.seoService.setTitleAndMetaTags(this.titleAndMetaTags);
        this.user$ = authService.user$;
    }

    ngOnInit() {}

    ngOnDestroy() {
        this.destroy.next();
    }

    createAnonymousUser() {
        this.authService.createAnonymousUser();
    }
}
