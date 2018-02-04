import {
    Controller,
    Get,
    Post,
    Req,
    Res,
    Next,
    HttpStatus,
    HttpException,
    Body,
    ReflectMetadata,
    UseGuards,
    Patch,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { EmailAndPasswordLoginInterface } from './email-and-password/email-and-password-login.interface';

@Controller('api/auth')
@UseGuards(RolesGuard)
export class AuthController {
    useSecure: boolean = process.env.SESSION_ID_SECURE_COOKIE === 'true';

    constructor(private readonly authService: AuthService) {}

    @Post('login-email-and-password-user')
    async loginEmailAndPasswordUser(
        @Res() res: Response,
        @Body() body: EmailAndPasswordLoginInterface
    ) {
        const loginResult = await this.authService.loginEmailAndPasswordUser(body);
        if (loginResult.apiCallResult) {
            this.sendSuccessfulUserResult(res, loginResult.result);
        } else {
            res.status(401).json(loginResult.result.error);
        }
    }

    @Post('create-email-and-password-user')
    async createEmailAndPasswordUser(
        @Res() res: Response,
        @Body() body: EmailAndPasswordLoginInterface
    ) {
        const createUserResult = await this.authService.createEmailAndPasswordUser(body);
        if (createUserResult.apiCallResult) {
            this.sendSuccessfulUserResult(res, createUserResult.result);
        } else {
            switch (createUserResult.result.error) {
                case 'Email already in use':
                    res.status(409).json(createUserResult.result.error);
                    break;

                case 'Error creating new user':
                    res.sendStatus(500);
                    break;

                default:
                    res.status(401).json(createUserResult.result.error);
                    break;
            }
        }
    }

    @Post('create-anonymous-user')
    async createAnonymousUser(@Res() res: Response) {
        const createAnonymousUserResult = await this.authService.createAnonymousUser();
        if (createAnonymousUserResult.apiCallResult) {
            this.sendSuccessfulUserResult(res, createAnonymousUserResult.result);
        } else {
            res.status(401).json(createAnonymousUserResult.result.error);
        }
    }

    @Patch('upgrade-anonymous-user-to-email-and-password')
    async upgradeAnonymousUser(
        @Req() req: Request,
        @Res() res: Response,
        @Body() body: EmailAndPasswordLoginInterface
    ) {
        const upgradeResult = await this.authService.upgradeAnonymousUserToEmailAndPassword(
            req,
            body
        );
        if (upgradeResult.apiCallResult) {
            this.sendSuccessfulUserResult(res, upgradeResult.result);
        } else {
            switch (upgradeResult.result.error) {
                case 'User is not anonymous':
                    res.status(409).json({ error: 'User is not anonymous' });
                    break;

                default:
                    res.status(401).json(upgradeResult.result.error);
                    break;
            }
        }
    }

    @Post('request-password-reset')
    async requestPasswordReset(
        @Req() req: Request,
        @Res() res: Response,
        @Body() body: { email: string }
    ) {
        const requestPasswordResetResult = await this.authService.requestPasswordReset(body);
        if (requestPasswordResetResult.apiCallResult) {
            res.status(200).json({ result: 'password reset email sent' });
        } else {
            res.status(401).json(requestPasswordResetResult.result.error);
        }
    }

    @Post('reset-password')
    async resetPassword(
        @Req() req: Request,
        @Res() res: Response,
        @Body() body: { password: string; token: string }
    ) {
        const resetPasswordResult = await this.authService.resetPassword(body);
        if (resetPasswordResult.apiCallResult) {
            this.sendSuccessfulUserResult(res, resetPasswordResult.result);
        } else {
            res.status(401).json(resetPasswordResult.result.error);
        }
    }

    @Post('change-password')
    @Roles('user')
    async changePassword(@Req() req: Request, @Res() res: Response, @Body() body) {
        const jwt = await req['user'];
        const changePasswordResult = await this.authService.changePassword(body, jwt);
        if (changePasswordResult.apiCallResult) {
            res.status(200).json(changePasswordResult.result);
        } else {
            res.status(401).json(changePasswordResult.result.error);
        }
    }

    @Post('reauthenticate')
    async reauthenticateUser(@Req() req: Request, @Res() res: Response) {
        const jwt = await req['user'];
        const reauthenticateResult = await this.authService.reauthenticateUser(jwt);
        if (reauthenticateResult.apiCallResult) {
            this.sendUserDetails(reauthenticateResult.result.user, res);
        } else {
            res.clearCookie('SESSIONID');
            await res.clearCookie('XSRF-TOKEN');
            res.status(401).json(reauthenticateResult.result.error);
        }
    }

    @Post('delete-account')
    @Roles('user')
    async deleteAccount(@Req() req: Request, @Res() res: Response) {
        const jwt = await req['user'];
        const deleteAccountResult = await this.authService.deleteAccount(jwt);
        if (deleteAccountResult.apiCallResult) {
            res.clearCookie('SESSIONID');
            await res.clearCookie('XSRF-TOKEN');
            return res.status(200).json({ result: 'account permanently deleted' });
        } else {
            res.status(401).json(deleteAccountResult.result.error);
        }
    }

    @Post('logout')
    async logout(@Res() res: Response) {
        res.clearCookie('SESSIONID');
        await res.clearCookie('XSRF-TOKEN');
        return res.status(200).json({ goodbye: 'come again soon' });
    }

    private sendSuccessfulUserResult(res: Response, authServiceResult) {
        const { user, sessionToken, csrfToken } = authServiceResult;
        res.cookie('SESSIONID', sessionToken, {
            httpOnly: true,
            secure: this.useSecure,
        });
        res.cookie('XSRF-TOKEN', csrfToken);
        this.sendUserDetails(user, res);
    }

    private sendUserDetails(user, res) {
        let email: string;
        try {
            email = user.emailAndPasswordProvider.email;
        } catch (e) {
            email = null;
        }
        res.status(200).json({
            id: user.id,
            isAnonymous: user.isAnonymous,
            roles: user.roles,
            email,
        });
    }
}
