import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('*')
export class ServerSideRenderingController {
    renderCache: {} = {};

    @Get()
    public routesRender(@Req() req: Request, @Res() res: Response) {
        if (this.renderCache[req.originalUrl]) {
            return res.send(this.renderCache[req.originalUrl]);
        }

        res.render('index', { req }, (err, html) => {
            // prevent caching these routes
            if (req.originalUrl.startsWith('/admin')) {
                return res.send(html);
            } else {
                this.renderCache[req.originalUrl] = html;
                return res.send(html);
            }
        });
    }
}
