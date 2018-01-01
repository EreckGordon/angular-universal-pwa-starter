import { Middleware, NestMiddleware, ExpressMiddleware } from '@nestjs/common';
import { SecurityService } from '../security/security.service';
import { Request, Response, NextFunction } from 'express';

@Middleware()
export class RetrieveUserIdFromRequestMiddleware implements NestMiddleware {
    constructor (private readonly securityService: SecurityService) { }
    async resolve(): Promise<ExpressMiddleware> {
        return async (req: Request, res: Response, next: NextFunction) => {
            const jwt = req.cookies["SESSIONID"];
            if (jwt) {
                try {
                    const payload = await this.securityService.decodeJwt(jwt);
                    req["user"] = payload;
                    next()
                }
                catch (err) {
                    console.log("Error: Could not extract user from request:", err.message);
                    next()
                }
            }
            else {
                next();
            }
        };
    }

}
