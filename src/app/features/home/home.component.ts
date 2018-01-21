import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { Observable } from 'rxjs/Observable';

import { SEOService } from '../../shared/seo.service';
import { AuthService, UserOrError } from '../../shared/auth/auth.service';

import 'rxjs/add/operator/take';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
    loginForm: FormGroup;
    createUserForm: FormGroup;
    upgradeAnonymousUserForm: FormGroup;
    keywords = 'angular, universal, angular-cli, PWA, nestjs';
    description = 'Angular Universal PWA, built with nestjs and typeorm.';
    user$: Observable<UserOrError>;

    constructor (public seoService: SEOService, private http: HttpClient, public fb: FormBuilder, public authService: AuthService) {
        this.seoService.setPageTitle('angular universal pwa - home');
        this.seoService.setKeywordsAndDescription(this.keywords, this.description);
        this.user$ = authService.user$;
    }

    ngOnInit() {
        this.loginForm = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });

        this.createUserForm = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });

        this.upgradeAnonymousUserForm = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    helloWorld() {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const options = { headers, withCredentials: true };
        const body = { hello: 'world' };
        const helloWorld = this.http.post('http://localhost:8000/hello-world', body, options)
            .take(1).subscribe(result => {
                console.log(result);
            }, (error) => console.log(error));
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
        this.authService.createEmailAndPasswordUser({ email, password });
    }

    createAnonymousUser() {
        this.authService.createAnonymousUser();
    }

    upgradeAnonymousUserToEmailAndPasswordUser() {
        const email = this.upgradeAnonymousUserForm.value.email;
        const password = this.upgradeAnonymousUserForm.value.password;
        this.authService.upgradeAnonymousUserToEmailAndPasswordUser({ email, password });
    }

}
