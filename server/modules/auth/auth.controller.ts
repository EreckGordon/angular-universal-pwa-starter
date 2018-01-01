import { Controller, Get, Post, Req, Res, Next, HttpStatus, HttpException, Body, ReflectMetadata, UseGuards } from '@nestjs/common';
import { Request, Response, } from 'express';

import { AuthService } from './auth.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

interface EmailAndPasswordLoginInterface {
    email: string;
    password: string;
}


@Controller('auth')
@UseGuards(RolesGuard)
export class AuthController {
    useSecure: boolean = process.env.SESSION_ID_SECURE_COOKIE === 'true';

    constructor (private readonly authService: AuthService) { }

    @Post('login-email-and-password-user')
    async login( @Res() res: Response, @Body() body: EmailAndPasswordLoginInterface) {
        const loginResult = await this.authService.loginEmailAndPasswordUser(body)
        if (loginResult.apiCallResult) {
            const { user, sessionToken, csrfToken } = loginResult.result
            res.cookie("SESSIONID", sessionToken, { httpOnly: true, secure: this.useSecure });
            res.cookie("XSRF-TOKEN", csrfToken);
            res.status(200).json({ id: user.id, email: body.email, roles: user.roles });
        }
        else {
            res.status(401).json(loginResult.result.error)
        }
    }

    @Post('create-email-and-password-user')
    async createUser( @Res() res: Response, @Body() body: EmailAndPasswordLoginInterface) {
        const createUserResult = await this.authService.createEmailAndPasswordUser(body);
        if (createUserResult.apiCallResult) {
            const { user, sessionToken, csrfToken } = createUserResult.result
            res.cookie("SESSIONID", sessionToken, { httpOnly: true, secure: this.useSecure });
            res.cookie("XSRF-TOKEN", csrfToken);
            res.status(200).json({ id: user.id, email: user.emailAndPasswordProvider.email, roles: user.roles });
        }
        else {
            switch (createUserResult.result.error) {
                case "Email already in use":
                    res.status(409).json({ error: 'Email already in use' });
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

    @Post('logout')
    @Roles('user')
    async logout( @Res() res: Response) {
        await res.clearCookie("SESSIONID");
        await res.clearCookie("XSRF-TOKEN");
        return res.sendStatus(200);
    }

}
