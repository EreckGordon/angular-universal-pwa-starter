import { Controller, Get, Request, Response } from '@nestjs/common';


@Controller('*')
export class AppController {

    @Get()
    public async routesRender( @Request() req: any, @Response() res: any) {
        res.render('index', { req })
    }

}
