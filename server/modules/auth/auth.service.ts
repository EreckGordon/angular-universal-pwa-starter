import { Component, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { EmailAndPasswordService } from './email-and-password/email-and-password.service';
import { AnonymousService } from './anonymous/anonymous.service';
import { EmailAndPasswordLoginInterface } from './email-and-password/email-and-password-login.interface';
import { Request } from 'express';

interface AuthResult {
    apiCallResult: boolean;
    result: {
        user?: User;
        sessionToken?: string;
        csrfToken?: string;
        error?: any;
    }
}


@Component()
export class AuthService {
    constructor (
        private readonly emailAndPasswordService: EmailAndPasswordService,
        private readonly anonymousService: AnonymousService,
        @Inject('UserRepositoryToken') private readonly userRepository: Repository<User>,
    ) { }

    async loginEmailAndPasswordUser(body: EmailAndPasswordLoginInterface): Promise<AuthResult> {

        const user = await this.emailAndPasswordService.findUserByEmail(body.email);
        const userExists = user === undefined ? false : true;

        if (!userExists) {
            const result: AuthResult = { apiCallResult: false, result: { error: 'user does not exist' } }
            return result
        }

        else {
            try {
                const loginResult = await this.emailAndPasswordService.loginAndCreateSession(body, user);
                if (loginResult["message"] === 'Password Invalid') throw new Error('Password Invalid');
                const result: AuthResult = {
                    apiCallResult: true,
                    result: {
                        user,
                        sessionToken: loginResult.sessionToken,
                        csrfToken: loginResult.csrfToken
                    }
                };
                return result
            }
            catch (error) {
                const result: AuthResult = { apiCallResult: false, result: { error: 'Password Invalid' } }
                return result
            }
        }

    }

    private async verifyEmailAndPasswordValidity(body: EmailAndPasswordLoginInterface) {

        const usernameTaken = await this.emailAndPasswordService.emailTaken(body.email)

        if (usernameTaken) {
            const result: AuthResult = { apiCallResult: false, result: { error: 'Email already in use' } }
            return result
        }

        const passwordErrors = this.emailAndPasswordService.validatePassword(body.password);

        if (passwordErrors.length > 0) {
            const result: AuthResult = { apiCallResult: false, result: { error: passwordErrors } }
            return result;
        }

        return 'success';

    }

    async createEmailAndPasswordUser(body: EmailAndPasswordLoginInterface): Promise<AuthResult> {

        const verifyResult = await this.verifyEmailAndPasswordValidity(body)

        if (verifyResult !== 'success') return verifyResult;

        else {
            try {
                const createUserResult = await this.emailAndPasswordService.createEmailAndPasswordUserAndSession(body);
                const result: AuthResult = {
                    apiCallResult: true,
                    result: {
                        user: createUserResult.user,
                        sessionToken: createUserResult.sessionToken,
                        csrfToken: createUserResult.csrfToken
                    }
                };
                return result
            }
            catch (e) {
                const result: AuthResult = { apiCallResult: false, result: { error: 'Error creating new email and password user' } }
                return result
            }
        }

    }

    async createAnonymousUser(): Promise<AuthResult> {
        try {
            const createAnonymousUserResult = await this.anonymousService.createAnonymousUserAndSession();
            const result: AuthResult = {
                apiCallResult: true,
                result: {
                    user: createAnonymousUserResult.user,
                    sessionToken: createAnonymousUserResult.sessionToken,
                    csrfToken: createAnonymousUserResult.csrfToken
                }
            };
            return result
        }
        catch (e) {
            const result: AuthResult = { apiCallResult: false, result: { error: 'Error creating new anonymous user' } }
            return result
        }
    }

    async upgradeAnonymousUserToEmailAndPassword(req: Request, body: EmailAndPasswordLoginInterface): Promise<AuthResult> {

        const verifyResult = await this.verifyEmailAndPasswordValidity(body)

        if (verifyResult !== 'success') return verifyResult;

        else {
            try {
                const userId = req["user"]["sub"];
                const upgradeAnonymousUserToEmailAndPasswordResult = await this.emailAndPasswordService.upgradeAnonymousUserToEmailAndPassword({ email: body.email, password: body.password, userId });
                if (upgradeAnonymousUserToEmailAndPasswordResult["message"] === 'User is not anonymous') return <AuthResult>{ apiCallResult: false, result: { error: 'User is not anonymous' } };
                const result: AuthResult = {
                    apiCallResult: true,
                    result: {
                        user: upgradeAnonymousUserToEmailAndPasswordResult.user,
                        sessionToken: upgradeAnonymousUserToEmailAndPasswordResult.sessionToken,
                        csrfToken: upgradeAnonymousUserToEmailAndPasswordResult.csrfToken
                    }
                };
                return result
            }
            catch (e) {
                return <AuthResult>{ apiCallResult: false, result: { error: 'Not logged in' } }
            }
        }

    }

    async findUserByUuid(uuid: string) {
        return await this.userRepository.findOne(uuid);
    }

    async reauthenticateUser(jwt): Promise<AuthResult> {
        try {
            const user = await this.findUserByUuid(jwt["sub"]);
            if (user.isAnonymous) {
                return { apiCallResult: true, result: { user } }
            }
            switch (jwt["loginProvider"]) {
                case "emailAndPassword":
                    const emailProvider = await this.emailAndPasswordService.findEmailAndPasswordProviderById(user.emailAndPasswordProviderId)
                    user.emailAndPasswordProvider = emailProvider
                    return { apiCallResult: true, result: { user } }
            }
        }
        catch (e) {
            return { apiCallResult: false, result: { error: 'could not reauthenticate' } }
        }
    }

    async requestPasswordReset({ email }: { email: string }) {
        return await this.emailAndPasswordService.requestPasswordReset({ email })
    }

}
