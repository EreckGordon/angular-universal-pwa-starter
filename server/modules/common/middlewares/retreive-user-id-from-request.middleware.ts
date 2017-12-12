import { Middleware, NestMiddleware, ExpressMiddleware } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { Request, Response, NextFunction } from 'express';

@Middleware()
export class RetrieveUserIdFromRequestMiddleware implements NestMiddleware {
    constructor (private readonly authService: AuthService) { }
    async resolve(): Promise<ExpressMiddleware> {
        return async (req: Request, res: Response, next: NextFunction) => {
            const jwt = req.cookies["SESSIONID"];
            if (jwt) {
                try {
                    const payload = await this.authService.decodeJwt(jwt);
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



