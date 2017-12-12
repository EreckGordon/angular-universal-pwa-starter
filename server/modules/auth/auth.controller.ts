import { Controller, Get, Post, Req, Res, Next, HttpStatus, HttpException, Body, ReflectMetadata, UseGuards } from '@nestjs/common';
import { Request, Response, } from 'express';

import { AuthService } from './auth.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

interface LoginInterface {
    email: string;
    password: string;
}


@Controller('auth')
@UseGuards(RolesGuard)
export class AuthController {

    constructor (private readonly authService: AuthService) { }

    @Post('login')
    async login( @Res() res: Response, @Body() body: LoginInterface) {
        const loginResult = await this.authService.login(body)
        if (loginResult.apiCallResult) {
            const { user, sessionToken, csrfToken } = loginResult.result
            res.cookie("SESSIONID", sessionToken, { httpOnly: true, secure: true });
            res.cookie("XSRF-TOKEN", csrfToken);
            res.status(200).json({ id: user.id, email: user.email, roles: user.roles });
        }
        else {
            res.status(401).json(loginResult.result.error)
        }
    }

    @Post('logout')
    @Roles('user')
    async logout( @Res() res: Response) {
        await res.clearCookie("SESSIONID");
        await res.clearCookie("XSRF-TOKEN");
        return res.sendStatus(200);
    }

    @Post('create-user')
    async createUser( @Res() res: Response, @Body() body: LoginInterface) {
        const createUserResult = await this.authService.createUser(body);
        if (createUserResult.apiCallResult) {
            const { user, sessionToken, csrfToken } = createUserResult.result
            res.cookie("SESSIONID", sessionToken, { httpOnly: true, secure: true });
            res.cookie("XSRF-TOKEN", csrfToken);
            res.status(200).json({ id: user.id, email: user.email, roles: user.roles });
        }
        else {
            switch (createUserResult.result.error) {
                case "Email already in use":
                    res.sendStatus(409).json({ error: 'Email already in use' });
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

}
