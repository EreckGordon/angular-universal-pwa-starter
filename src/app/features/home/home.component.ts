import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SEOService } from '../../shared/seo.service';

import 'rxjs/add/operator/take';

@Component({
  selector: 'my-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

	keywords: string = 'angular, universal, angular-cli, PWA, expressjs';
	description: string = 'ngiso: Angular Isomorphic. It is a Progressive Web App (PWA) built with Angular Universal on Expressjs.';
  
    constructor(public seoService:SEOService, private http: HttpClient) {
    	this.seoService.setPageTitle('igiso - Angular Isomorphic');
    	this.seoService.setKeywordsAndDescription(this.keywords, this.description);
    }

    ngOnInit() {}

	helloWorld(){
		const headers = new HttpHeaders({'Content-Type': 'application/json'});
		const options = {
			headers, 
			withCredentials:true
		};
		const body = {
			hello: 'world'
		};
		const helloWorld = this.http.post('http://localhost:8000/api/hello-world', body, options)
	    .take(1).subscribe(result => {
	    	console.log(result)
	    }, (error) => console.log(error));

	}  

}
