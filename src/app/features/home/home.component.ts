import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';

import { TitleAndMetaTags } from '@interfaces/title-and-meta-tags.interface';

import { SEOService } from '@seo/seo.service';
import { AuthService, UserOrError } from '../../shared/auth/auth.service';
import { environment } from '../../../environments/environment';

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
        '@context': 'https://schema.org/'
    };
    loginForm: FormGroup;
    createUserForm: FormGroup;
    upgradeAnonymousUserForm: FormGroup;
    user$: Observable<UserOrError>;

    constructor(private seoService: SEOService, private http: HttpClient, public fb: FormBuilder, public authService: AuthService) {
        this.seoService.setTitleAndMetaTags(this.titleAndMetaTags);
        this.user$ = authService.user$;
    }

    ngOnInit() {}

    createAnonymousUser() {
        this.authService.createAnonymousUser();
    }
}
