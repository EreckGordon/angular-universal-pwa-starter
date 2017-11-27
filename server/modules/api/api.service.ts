import { Component } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { ArticleService } from '../article/article.service';
import { User } from '../auth/user.entity';

interface AuthResult {
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

  async login(body): Promise<AuthResult> {

      const credentials = body;

      const user = await this.authService.findUserByEmail(credentials.email);

      const userExists = user === undefined ? false : true;

      if (!userExists) {
      	const result: AuthResult = {apiCallResult: false, result: {error:'user does not exist'}}
        return result
      }

      else {
      	try {
      		const loginResult = await this.authService.loginAndCreateSession(credentials, user);
      		if (loginResult["message"]==="Password Invalid") throw new Error("Password Invalid");
      		const result: AuthResult = {
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
    		const result: AuthResult = {apiCallResult: false, result: {error: "Password Invalid"}}
    		return result
    	}
      }

  }

  async createUser(body): Promise<AuthResult> {

      const credentials = body;

      const usernameTaken = await this.authService.emailTaken(credentials.email)

      if (usernameTaken) {
      	const result: AuthResult = {apiCallResult: false, result: {error: 'Email already in use'}}
      	return result
      	//res.sendStatus(409).json({error: 'email already in use'});
      }

      const passwordErrors = this.authService.validatePassword(credentials.password);

      if (passwordErrors.length > 0) {
      	  const result: AuthResult = {apiCallResult: false, result: {error: passwordErrors}}
      	  return result;
      	  //res.status(400).json({passwordErrors});
      }

      else {
      	try{
          	const createUserResult = await this.authService.createUserAndSession(credentials);
      		const result: AuthResult = {
      			apiCallResult: true, 
      			result: {
      				user: createUserResult.user, 
      				sessionToken: createUserResult.sessionToken, 
      				csrfToken: createUserResult.csrfToken
      			}
      		};
        	return result 
      //something similar will be sent in the api controller for create-user
      //res.cookie("SESSIONID", sessionToken, {httpOnly:true, secure:true});

      //res.cookie("XSRF-TOKEN", csrfToken);

      //res.status(200).json({id:user.id, email:user.email, roles: user.roles});        	               		
      	}
      	catch(e){
          	const result: AuthResult = {apiCallResult: false, result: {error: 'Error creating new user'}}
            return result
            //res.sendStatus(500);      		
      	}

      }

  }  

}