import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('*')
export class AppController {
    renderCache: {} = {};

    @Get()
    public routesRender( @Req() req: Request, @Res() res: Response) {

        /*
        * add this if you want to blacklist certain routes from being cached
        if (req.originalUrl.startsWith('/admin')) {
            return res.render('index', { req })
        }
        */

        if (this.renderCache[req.originalUrl]) {
            return res.send(this.renderCache[req.originalUrl])
        }

        res.render('index', { req }, (err, html) => {
            this.renderCache[req.originalUrl] = html;
            return res.send(html);
        })
    }

}
