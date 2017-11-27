import { Controller, Get, Post, Req, Res, Next, HttpStatus, HttpException, Body, Param, ReflectMetadata } from '@nestjs/common';
import { Request, Response, } from 'express';

import { APIService } from './api.service';


@Controller('api')
export class APIController {
	
  constructor(private readonly apiService: APIService) {}

  @Post('hello-world')
  async helloWorld(@Res() res:Response, @Body() body){
  	console.log(body);
  	res.status(HttpStatus.OK).json({hello: "world"})
  }

  @Post('login')
  async login(@Res() res:Response, @Body() body){
  	const loginResult = await this.apiService.login(body)
  	if (loginResult.apiCallResult) {
          const {user, sessionToken, csrfToken} = loginResult.result
          res.cookie("SESSIONID", sessionToken, {httpOnly:true, secure:true});
		  res.cookie("XSRF-TOKEN", csrfToken);
		  res.status(200).json({id:user.id, email:user.email, roles: user.roles});		
  	}
  	else {
  		res.status(401).json({error: loginResult.result.error})
  	}
  	
  }


  @Post('logout')
  async logout(@Res() res:Response, @Body() body){
  	const result = await this.apiService.logout()
  	// this one had me checking auth status and csrf status via middleware before logging out. i guess i should use that middleware somehow.
  	// return a result or an error code depending on the result of the logout request.  	
  }

  @Post('create-user')
  async createUser(@Res() res:Response, @Body() body){
  	const result = await this.apiService.createUser(body)
  	// return a result or an error code depending on the result of the create user request.  
  }  

}