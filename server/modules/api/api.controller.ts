import { Controller, Get, Post, Req, Res, HttpStatus, HttpException, Body, Param, ReflectMetadata } from '@nestjs/common';

import { APIService } from './api.service';


@Controller('api')
export class APIController {
	
  constructor(private readonly apiService: APIService) {}

}