import { Controller, Get, Post, Req, Res, Next, HttpStatus, HttpException, Body, Param, ReflectMetadata } from '@nestjs/common';
import { Request, Response, } from 'express';

import { APIService } from './api.service';

interface LoginInterface {
	email: string,
	password: string
}


@Controller('api')
export class APIController {
	
  constructor(private readonly apiService: APIService) {}

  @Post('hello-world')
  async helloWorld(@Res() res:Response, @Body() body){
  	console.log(body);
  	res.status(HttpStatus.OK).json({hello: "world"})
  }

  @Post('login')
  async login(@Res() res:Response, @Body() body:LoginInterface){
  	const loginResult = await this.apiService.login(body)
  	if (loginResult.apiCallResult) {
          const {user, sessionToken, csrfToken} = loginResult.result
          res.cookie("SESSIONID", sessionToken, {httpOnly:true, secure:true});
		  res.cookie("XSRF-TOKEN", csrfToken);
		  res.status(200).json({id:user.id, email:user.email, roles: user.roles});		
  	}
  	else {
  		res.status(401).json(loginResult.result.error)
  	}  	
  }

  @Post('logout')
  async logout(@Res() res:Response){
      res.clearCookie("SESSIONID");
      res.clearCookie("XSRF-TOKEN");
      res.sendStatus(200);  		
  }

  @Post('create-user')
  async createUser(@Res() res:Response, @Body() body:LoginInterface){
  	const createUserResult = await this.apiService.createUser(body);
  	if (createUserResult.apiCallResult){
  		const {user, sessionToken, csrfToken} = createUserResult.result
  		res.cookie("SESSIONID", sessionToken, {httpOnly:true, secure:true});
  		res.cookie("XSRF-TOKEN", csrfToken);
  		res.status(200).json({id:user.id, email:user.email, roles: user.roles});  
  	}
  	else {  		
  		switch (createUserResult.result.error) {
  			case "Email already in use":
  				res.sendStatus(409).json({error: 'Email already in use'});
  				break;

  			case "Error creating new user":
  				res.sendStatus(500); 
  				break;

  			default:
  				res.status(400).json(createUserResult.result.error);
  				break;
  		}
  	} 
  }  

}