import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { SEOService } from '../../shared/seo.service';

import 'rxjs/add/operator/take';

@Component({
  selector: 'my-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
	loginForm:FormGroup;
	createUserForm:FormGroup;
	keywords: string = 'angular, universal, angular-cli, PWA, expressjs';
	description: string = 'ngiso: Angular Isomorphic. It is a Progressive Web App (PWA) built with Angular Universal on Expressjs.';
  
    constructor(public seoService:SEOService, private http: HttpClient, public fb:FormBuilder) {
    	this.seoService.setPageTitle('igiso - Angular Isomorphic');
    	this.seoService.setKeywordsAndDescription(this.keywords, this.description);
    }

    ngOnInit() {
    	console.log('cookie', document.cookie)
		this.loginForm = this.fb.group({
	      email: ['',Validators.required],
	      password: ['',Validators.required]
	    });    	

		this.createUserForm = this.fb.group({
	      email: ['',Validators.required],
	      password: ['',Validators.required]
	    });    		    
    }

	helloWorld(){
		const headers = new HttpHeaders({'Content-Type': 'application/json'});
		const options = {headers, withCredentials:true};
		const body = {hello: 'world'};
		const helloWorld = this.http.post('http://localhost:8000/api/hello-world', body, options)
	    .take(1).subscribe(result => {
	    	console.log(result)
	    }, (error) => console.log(error));

	}  

	login(){
		const email = this.loginForm.value.email
		const password = this.loginForm.value.password
		const headers = new HttpHeaders({'Content-Type': 'application/json'});
		const options = {headers, withCredentials:true};
		const body = {email, password};
		const loginResult = this.http.post('http://localhost:8000/api/login', body, options)
	    .take(1).subscribe(result => {
	    	console.log(result)
	    }, (error) => console.log(error));

	}  	

	logout(){
		const headers = new HttpHeaders({'Content-Type': 'application/json'});
		const options = {headers, withCredentials:true};
		const body = {bye: '!'};
		const logoutResult = this.http.post('http://localhost:8000/api/logout', body, options)
	    .take(1).subscribe(result => {
	    	console.log(result)
	    }, (error) => console.log(error));

	}  

	createUser(){
		const email = this.createUserForm.value.email
		const password = this.createUserForm.value.password
		const headers = new HttpHeaders({'Content-Type': 'application/json'});
		const options = {headers, withCredentials:true};
		const body = {email, password};
		const createUserResult = this.http.post('http://localhost:8000/api/create-user', body, options)
	    .take(1).subscribe(result => {
	    	console.log(result)
	    }, (error) => console.log(error));

	}  

}
