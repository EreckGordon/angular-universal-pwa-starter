import { Component, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Request } from 'express';

import { SocialUser } from '../../../src/app/shared/auth/social-module/classes/social-user.class';

import { User } from './user.entity';
import { EmailAndPasswordService } from './email-and-password/email-and-password.service';
import { AnonymousService } from './anonymous/anonymous.service';
import { EmailAndPasswordLoginInterface } from './email-and-password/email-and-password-login.interface';
import { MailgunService } from '../common/mailgun.service';
import { SecurityService } from '../common/security/security.service';

interface AuthResult {
    apiCallResult: boolean;
    result: {
        user?: User;
        sessionToken?: string;
        csrfToken?: string;
        error?: any;
    };
}

interface UserJWT {
    roles: string[];
    loginProvider: string;
    iat: number;
    exp: number;
    sub: string;
}

@Component()
export class AuthService {
    constructor(
        private readonly emailAndPasswordService: EmailAndPasswordService,
        private readonly anonymousService: AnonymousService,
        @Inject('UserRepositoryToken') private readonly userRepository: Repository<User>,
        private readonly mailgunService: MailgunService,
        private readonly securityService: SecurityService
    ) {}

    async loginEmailAndPasswordUser(body: EmailAndPasswordLoginInterface): Promise<AuthResult> {
        const user = await this.emailAndPasswordService.findUserByEmail(body.email);
        const userExists = user === undefined ? false : true;

        if (!userExists) {
            return {
                apiCallResult: false,
                result: { error: 'user does not exist' },
            };
        } else {
            try {
                const loginResult = await this.emailAndPasswordService.loginAndCreateSession(
                    body,
                    user
                );
                if (loginResult['message'] === 'Password Invalid')
                    throw new Error('Password Invalid');
                const result: AuthResult = {
                    apiCallResult: true,
                    result: {
                        user,
                        sessionToken: loginResult.sessionToken,
                        csrfToken: loginResult.csrfToken,
                    },
                };
                return result;
            } catch (error) {
                const result: AuthResult = {
                    apiCallResult: false,
                    result: { error: 'Password Invalid' },
                };
                return result;
            }
        }
    }

    async authenticateSocialUser(socialUser: SocialUser): Promise<AuthResult> {
        console.log(socialUser);
        try {
            // switch case depending on social provider 'google' 'facebook'
            // verify that the info sent to us is an actual good token by hitting social provider's api
            // look up user by socialUid in relevant social provider db slice
            // if exists, log in as them.
            // if does not exist, create new user and then log in as them.

            const result: AuthResult = {
                apiCallResult: false,
                result: { error: 'function still being built' },
            };
            return result;
        } catch (e) {
            const result: AuthResult = {
                apiCallResult: false,
                result: { error: 'Error authenticating social user' },
            };
            return result;
        }
    }

    private async verifyEmailAndPasswordValidity(body: EmailAndPasswordLoginInterface) {
        const usernameTaken = await this.emailAndPasswordService.emailTaken(body.email);

        if (usernameTaken) {
            const result: AuthResult = {
                apiCallResult: false,
                result: { error: 'Email already in use' },
            };
            return result;
        }

        const passwordErrors = this.emailAndPasswordService.validatePassword(body.password);

        if (passwordErrors.length > 0) {
            const result: AuthResult = {
                apiCallResult: false,
                result: { error: passwordErrors },
            };
            return result;
        }

        return 'success';
    }

    async createEmailAndPasswordUser(body: EmailAndPasswordLoginInterface): Promise<AuthResult> {
        const verifyResult = await this.verifyEmailAndPasswordValidity(body);

        if (verifyResult !== 'success') return verifyResult;
        else {
            try {
                const createUserResult = await this.emailAndPasswordService.createEmailAndPasswordUserAndSession(
                    body
                );
                const result: AuthResult = {
                    apiCallResult: true,
                    result: {
                        user: createUserResult.user,
                        sessionToken: createUserResult.sessionToken,
                        csrfToken: createUserResult.csrfToken,
                    },
                };
                return result;
            } catch (e) {
                const result: AuthResult = {
                    apiCallResult: false,
                    result: {
                        error: 'Error creating new email and password user',
                    },
                };
                return result;
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
                    csrfToken: createAnonymousUserResult.csrfToken,
                },
            };
            return result;
        } catch (e) {
            const result: AuthResult = {
                apiCallResult: false,
                result: { error: 'Error creating new anonymous user' },
            };
            return result;
        }
    }

    async upgradeAnonymousUserToEmailAndPassword(
        req: Request,
        body: EmailAndPasswordLoginInterface
    ): Promise<AuthResult> {
        const verifyResult = await this.verifyEmailAndPasswordValidity(body);

        if (verifyResult !== 'success') return verifyResult;
        else {
            try {
                const userId = req['user']['sub'];
                const upgradeAnonymousUserToEmailAndPasswordResult = await this.emailAndPasswordService.upgradeAnonymousUserToEmailAndPassword(
                    { email: body.email, password: body.password, userId }
                );
                if (
                    upgradeAnonymousUserToEmailAndPasswordResult['message'] ===
                    'User is not anonymous'
                )
                    return <AuthResult>{
                        apiCallResult: false,
                        result: { error: 'User is not anonymous' },
                    };
                const result: AuthResult = {
                    apiCallResult: true,
                    result: {
                        user: upgradeAnonymousUserToEmailAndPasswordResult.user,
                        sessionToken: upgradeAnonymousUserToEmailAndPasswordResult.sessionToken,
                        csrfToken: upgradeAnonymousUserToEmailAndPasswordResult.csrfToken,
                    },
                };
                return result;
            } catch (e) {
                return <AuthResult>{
                    apiCallResult: false,
                    result: { error: 'Not logged in' },
                };
            }
        }
    }

    async findUserByUuid(uuid: string) {
        return await this.userRepository.findOne(uuid);
    }

    async reauthenticateUser(jwt): Promise<AuthResult> {
        try {
            const user = await this.findUserByUuid(jwt['sub']);
            if (user.isAnonymous) {
                return { apiCallResult: true, result: { user } };
            }
            switch (jwt['loginProvider']) {
                case 'emailAndPassword':
                    const emailProvider = await this.emailAndPasswordService.findEmailAndPasswordProviderById(
                        user.emailAndPasswordProviderId
                    );
                    user.emailAndPasswordProvider = emailProvider;
                    return { apiCallResult: true, result: { user } };
            }
        } catch (e) {
            return {
                apiCallResult: false,
                result: { error: 'could not reauthenticate' },
            };
        }
    }

    async requestPasswordReset({ email }: { email: string }): Promise<AuthResult> {
        try {
            const user = await this.emailAndPasswordService.findUserByEmail(email);
            const userExists = user === undefined ? false : true;
            if (!userExists)
                return {
                    apiCallResult: false,
                    result: { error: 'user does not exist' },
                };
            const token = await this.securityService.createPasswordResetToken(email);
            const emailAndPasswordProvider = await this.emailAndPasswordService.findEmailAndPasswordProviderById(
                user.emailAndPasswordProviderId
            );
            user.emailAndPasswordProvider = emailAndPasswordProvider;
            user.emailAndPasswordProvider.passwordResetToken = token;
            await this.userRepository.save(user);
            const passwordResetEmail = await this.mailgunService.sendPasswordResetEmail({
                email,
                token,
            });
            return { apiCallResult: true, result: {} };
        } catch (e) {
            return {
                apiCallResult: false,
                result: { error: 'error requesting password reset' },
            };
        }
    }

    async resetPassword({
        password,
        token,
    }: {
        password: string;
        token: string;
    }): Promise<AuthResult> {
        try {
            const decodedTokenOrError = await this.securityService.decodePasswordResetToken(token);
            if (decodedTokenOrError === 'jwt expired')
                return {
                    apiCallResult: false,
                    result: { error: 'jwt expired' },
                };
            const emailAndPasswordProvider = await this.emailAndPasswordService.findEmailAndPasswordProviderByEmail(
                decodedTokenOrError.email
            );
            if (token !== emailAndPasswordProvider.passwordResetToken)
                return {
                    apiCallResult: false,
                    result: { error: 'jwt does not match database' },
                };
            emailAndPasswordProvider.passwordResetToken = null;
            const passwordErrors = this.emailAndPasswordService.validatePassword(password);
            if (passwordErrors.length > 0)
                return {
                    apiCallResult: false,
                    result: { error: passwordErrors },
                };
            const passwordHash = await this.securityService.createPasswordHash({
                password,
            });
            emailAndPasswordProvider.passwordHash = passwordHash;
            const user = await this.emailAndPasswordService.findUserAccountByEmailAndPasswordProviderId(
                emailAndPasswordProvider.id
            );
            user.emailAndPasswordProvider = emailAndPasswordProvider;
            await this.userRepository.save(user);
            const sessionToken = await this.securityService.createSessionToken({
                roles: user.roles,
                id: user.id,
                loginProvider: 'emailAndPassword',
            });
            const csrfToken = await this.securityService.createCsrfToken();
            return {
                apiCallResult: true,
                result: { user, sessionToken, csrfToken },
            };
        } catch (e) {
            return {
                apiCallResult: false,
                result: { error: 'error resetting password' },
            };
        }
    }

    async changePassword(
        body: { oldPassword: string; newPassword: string },
        jwt: UserJWT
    ): Promise<AuthResult> {
        try {
            const user: User = await this.userRepository.findOne(jwt.sub);
            const emailAndPasswordProvider = await this.emailAndPasswordService.findEmailAndPasswordProviderById(
                user.emailAndPasswordProviderId
            );
            const isPasswordValid = await this.securityService.verifyPasswordHash({
                passwordHash: emailAndPasswordProvider.passwordHash,
                password: body.oldPassword,
            });
            if (!isPasswordValid)
                return {
                    apiCallResult: false,
                    result: { error: 'Password Invalid' },
                };
            const passwordErrors = this.emailAndPasswordService.validatePassword(body.newPassword);
            if (passwordErrors.length > 0)
                return {
                    apiCallResult: false,
                    result: { error: passwordErrors },
                };
            const newPasswordHash = await this.securityService.createPasswordHash({
                password: body.newPassword,
            });
            emailAndPasswordProvider.passwordHash = newPasswordHash;
            await this.emailAndPasswordService.updateEmailAndPasswordProvider(
                emailAndPasswordProvider
            );
            return { apiCallResult: true, result: {} };
        } catch (e) {
            return {
                apiCallResult: false,
                result: { error: 'error changing password' },
            };
        }
    }

    async deleteAccount(jwt: UserJWT): Promise<AuthResult> {
        try {
            const userToBeDeleted = await this.userRepository.findOne(jwt.sub);
            const providerToBeDeleted = async () => {
                switch (jwt.loginProvider) {
                    case 'emailAndPassword':
                        return await this.emailAndPasswordService.findEmailAndPasswordProviderById(
                            userToBeDeleted.emailAndPasswordProviderId
                        );
                }
            };
            await this.userRepository.remove(userToBeDeleted);
            await this.emailAndPasswordService.removeEmailAndPasswordProvider(
                await providerToBeDeleted()
            );

            return { apiCallResult: true, result: {} };
        } catch (e) {
            return {
                apiCallResult: false,
                result: { error: 'error deleting account' },
            };
        }
    }
}
