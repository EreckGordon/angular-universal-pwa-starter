import { Component } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { ArticleService } from '../article/article.service';
import { User } from '../auth/user.entity';

interface UserSessionCSRFResult {
	apiCallResult: boolean,
	result: {
		user?: User,
		sessionToken?: string,
		csrfToken?:string,
		error?: any
	}
}


@Component()
export class APIService {

  constructor(
  	private readonly authService: AuthService, 
  	private readonly articleService:ArticleService
  ) {}

  get publicRSAKey(){
  	return this.authService.publicRSAKey
  }


  async login(body): Promise<UserSessionCSRFResult> {

      const credentials = body;

      const user = await this.authService.findUserByEmail(credentials.email);

      const userExists = user === undefined ? false : true;

      if (!userExists) {
      	const result: UserSessionCSRFResult = {apiCallResult: false, result: {error:'user does not exist'}}
        return result
      }

      else {
      	try {
      		const loginResult = await this.authService.loginAndCreateSession(credentials, user);
      		if (loginResult["message"]==="Password Invalid") throw new Error("Password Invalid");
      		const result: UserSessionCSRFResult = {
      			apiCallResult: true, 
      			result: {
      				user, 
      				sessionToken: loginResult.sessionToken, 
      				csrfToken: loginResult.csrfToken
      			}
      		};
        	return result
    	}
    	catch (error) {
    		const result: UserSessionCSRFResult = {apiCallResult: false, result: {error: "Password Invalid"}}
    		return result
    	}
      }

  }

  logout() {

      //res.clearCookie("SESSIONID");

      //res.clearCookie("XSRF-TOKEN");

      //res.sendStatus(200);
  }

  async createUser(body) {

      /*const credentials = body;

      const usernameTaken = await this.checkIfUserExists(credentials.email)

      if (usernameTaken) res.sendStatus(409).json({error: 'email already in use'});

      const passwordErrors = auth.validatePassword(credentials.password);

      if (passwordErrors.length > 0) {
          res.status(400).json({passwordErrors});
      }

      else {

          this.createUserAndSession(res, credentials)
              .catch((err) => {
              console.log("Error creating new user", err);
              res.sendStatus(500);
          });

      }*/

  }  

}