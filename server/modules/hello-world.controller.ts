import { Controller, Post, Res, Body, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Controller('hello-world')
export class HelloWorldController {
    @Post()
    async helloWorld(@Res() res: Response, @Body() body) {
        console.log(body);
        res.status(HttpStatus.OK).json({ hello: 'world' });
    }
}
