import { Controller, Get, Post, Req, Res, HttpStatus, HttpException, Body, Param, ReflectMetadata } from '@nestjs/common';

import { APIService } from './api.service';


@Controller('api')
export class APIController {
	
  constructor(private readonly apiService: APIService) {}

  @Post('hello-world')
  helloWorld(@Res() res, @Body() body){
  	console.log(body);
  	res.status(HttpStatus.OK).json({hello: "world"})
  }

}