import { Controller, Get, Post, Req, Res, Next, HttpStatus, HttpException, Body, ReflectMetadata, UseGuards, Patch } from '@nestjs/common';
import { Request, Response, } from 'express';

import { AuthService } from './auth.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { EmailAndPasswordLoginInterface } from './email-and-password/email-and-password-login.interface';


@Controller('auth')
@UseGuards(RolesGuard)
export class AuthController {
    useSecure: boolean = process.env.SESSION_ID_SECURE_COOKIE === 'true';

    constructor (private readonly authService: AuthService) { }

    @Post('login-email-and-password-user')
    async loginEmailAndPasswordUser( @Res() res: Response, @Body() body: EmailAndPasswordLoginInterface) {
        const loginResult = await this.authService.loginEmailAndPasswordUser(body)
        if (loginResult.apiCallResult) {
            this.sendSuccessfulUserResult(res, loginResult.result);
        }
        else {
            res.status(401).json(loginResult.result.error)
        }
    }

    @Post('create-email-and-password-user')
    async createEmailAndPasswordUser( @Res() res: Response, @Body() body: EmailAndPasswordLoginInterface) {
        const createUserResult = await this.authService.createEmailAndPasswordUser(body);
        if (createUserResult.apiCallResult) {
            this.sendSuccessfulUserResult(res, createUserResult.result);
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

    @Post('create-anonymous-user')
    async createAnonymousUser( @Res() res: Response) {
        const createAnonymousUserResult = await this.authService.createAnonymousUser()
        if (createAnonymousUserResult.apiCallResult) {
            this.sendSuccessfulUserResult(res, createAnonymousUserResult.result);
        }
        else {
            res.status(401).json(createAnonymousUserResult.result.error)
        }
    }

    @Patch('upgrade-anonymous-user-to-email-and-password')
    async upgradeAnonymousUser( @Req() req: Request, @Res() res: Response, @Body() body: EmailAndPasswordLoginInterface) {
        const upgradeResult = await this.authService.upgradeAnonymousUserToEmailAndPassword(req, body)
        if (upgradeResult.apiCallResult) {
            this.sendSuccessfulUserResult(res, upgradeResult.result);
        }
        else {
            switch (upgradeResult.result.error) {
                case "User is not anonymous":
                    res.status(409).json({ error: 'User is not anonymous' })
                    break;

                default:
                    res.status(401).json(upgradeResult.result.error);
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

    private sendSuccessfulUserResult(res: Response, authServiceResult) {
        const { user, sessionToken, csrfToken } = authServiceResult
        res.cookie("SESSIONID", sessionToken, { httpOnly: true, secure: this.useSecure });
        res.cookie("XSRF-TOKEN", csrfToken);
        res.status(200).json({ id: user.id, isAnonymous: user.isAnonymous, roles: user.roles });
    }

}
