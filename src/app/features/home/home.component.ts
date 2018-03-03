import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { Observable } from 'rxjs/Observable';

import { TitleAndMetaTags } from '@interfaces/title-and-meta-tags.interface';

import { SEOService } from '../../shared/seo.service';
import { AuthService, UserOrError } from '../../shared/auth/auth.service';
import { environment } from '../../../environments/environment';

import 'rxjs/add/operator/take';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
    loginForm: FormGroup;
    createUserForm: FormGroup;
    upgradeAnonymousUserForm: FormGroup;
    user$: Observable<UserOrError>;
    titleAndMetaTags: TitleAndMetaTags = {
        title: 'Angular Universal PWA Starter',
        description: 'Angular Universal PWA, built with NestJS and TypeORM.',
        url: 'https://universal-demo.ereckgordon.com/',
    };

    constructor(public seoService: SEOService, private http: HttpClient, public fb: FormBuilder, public authService: AuthService) {
        this.seoService.setTitleAndMetaTags(this.titleAndMetaTags);
        this.user$ = authService.user$;
    }

    ngOnInit() {
        this.loginForm = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required],
        });

        this.createUserForm = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required],
        });

        this.upgradeAnonymousUserForm = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required],
        });
    }

    helloWorld() {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const options = { headers, withCredentials: true };
        const body = { hello: 'world' };
        const helloWorld = this.http
            .post(`${environment.baseUrl}/hello-world`, body, options)
            .take(1)
            .subscribe(
                result => {
                    console.log(result);
                },
                error => console.log(error)
            );
    }

    loginWithEmailAndPassword() {
        const email = this.loginForm.value.email;
        const password = this.loginForm.value.password;
        this.authService.loginWithEmailAndPassword({ email, password });
    }

    logout() {
        this.authService.logout();
    }

    createEmailAndPasswordUser() {
        const email = this.createUserForm.value.email;
        const password = this.createUserForm.value.password;
        this.authService.createEmailAndPasswordUserOrUpgradeAnonymousToEmailAndPassword({ email, password });
    }

    createAnonymousUser() {
        this.authService.createAnonymousUser();
    }

    upgradeAnonymousUserToEmailAndPasswordUser() {
        const email = this.upgradeAnonymousUserForm.value.email;
        const password = this.upgradeAnonymousUserForm.value.password;
        this.authService.createEmailAndPasswordUserOrUpgradeAnonymousToEmailAndPassword({
            email,
            password,
        });
    }
}
