import { Component, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Request } from 'express';

import { SocialUser } from '../../../src/app/shared/auth/social-module/classes/social-user.class';

import { User } from './user.entity';
import { EmailAndPasswordService } from './email-and-password/email-and-password.service';
import { AnonymousService } from './anonymous/anonymous.service';
import { EmailAndPasswordLoginInterface } from './interfaces/email-and-password-login.interface';
import { GoogleService } from './google/google.service';
import { FacebookService } from './facebook/facebook.service';
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

interface EmailAndPasswordUser {
    email: string;
    password: string;
    provider: 'emailAndPassword';
}

@Component()
export class AuthService {
    constructor(
        @Inject('UserRepositoryToken') private readonly userRepository: Repository<User>,
        private readonly emailAndPasswordService: EmailAndPasswordService,
        private readonly anonymousService: AnonymousService,
        private readonly googleService: GoogleService,
        private readonly facebookService: FacebookService,
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
                const loginResult = await this.emailAndPasswordService.loginAndCreateSession(body, user);
                if (loginResult['message'] === 'Password Invalid') throw new Error('Password Invalid');
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
        try {
            switch (socialUser.provider) {
                case 'google':
                    return this.authenticateGoogleUser(socialUser);
                case 'facebook':
                    return this.authenticateFacebookUser(socialUser);
            }
        } catch (e) {
            const result: AuthResult = {
                apiCallResult: false,
                result: { error: 'Invalid Social Provider. How did you trigger this error?' },
            };
            return result;
        }
    }

    private async authenticateGoogleUser(socialUser: SocialUser): Promise<AuthResult> {
        try {
            const verifiedGoogleJWT = await this.googleService.verifyIdToken(socialUser.idToken);
            if (verifiedGoogleJWT === false) {
                const result: AuthResult = {
                    apiCallResult: false,
                    result: { error: 'Invalid JWT' },
                };
                return result;
            }

            const googleProvider = await this.googleService.findGoogleProviderBySocialUid(socialUser.socialUid);

            if (googleProvider === undefined) {
                const createGoogleUserResult = await this.googleService.createGoogleUserSessionAndCSRF(socialUser);

                const result: AuthResult = {
                    apiCallResult: true,
                    result: {
                        user: createGoogleUserResult.user,
                        csrfToken: createGoogleUserResult.csrfToken,
                        sessionToken: createGoogleUserResult.sessionToken,
                    },
                };
                return result;
            }

            const loginGoogleUserResult = await this.googleService.loginGoogleUserSessionAndCSRF(googleProvider);

            const result: AuthResult = {
                apiCallResult: true,
                result: {
                    user: loginGoogleUserResult.user,
                    csrfToken: loginGoogleUserResult.csrfToken,
                    sessionToken: loginGoogleUserResult.sessionToken,
                },
            };
            return result;
        } catch (e) {
            const result: AuthResult = {
                apiCallResult: false,
                result: { error: 'unknown error authenticating google user' },
            };
            return result;
        }
    }

    private async authenticateFacebookUser(socialUser: SocialUser): Promise<AuthResult> {
        try {
            const verifiedAccessToken = await this.facebookService.verifyAccessToken(socialUser.accessToken);
            if (
                verifiedAccessToken === false ||
                socialUser.email !== verifiedAccessToken['email'] ||
                socialUser.socialUid !== verifiedAccessToken['id']
            ) {
                const result: AuthResult = {
                    apiCallResult: false,
                    result: { error: 'Invalid Access Token' },
                };
                return result;
            }
            const facebookProvider = await this.facebookService.findFacebookProviderBySocialUid(socialUser.socialUid);

            if (facebookProvider === undefined) {
                const createFacebookUserResult = await this.facebookService.createFacebookUserSessionAndCSRF(socialUser);

                const result: AuthResult = {
                    apiCallResult: true,
                    result: {
                        user: createFacebookUserResult.user,
                        csrfToken: createFacebookUserResult.csrfToken,
                        sessionToken: createFacebookUserResult.sessionToken,
                    },
                };
                return result;
            }

            const loginFacebookUserResult = await this.facebookService.loginFacebookUserSessionAndCSRF(facebookProvider);

            const result: AuthResult = {
                apiCallResult: true,
                result: {
                    user: loginFacebookUserResult.user,
                    csrfToken: loginFacebookUserResult.csrfToken,
                    sessionToken: loginFacebookUserResult.sessionToken,
                },
            };
            return result;
        } catch (e) {
            const result: AuthResult = {
                apiCallResult: false,
                result: { error: 'unknown error authenticating facebook user' },
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
                const createUserResult = await this.emailAndPasswordService.createEmailAndPasswordUserAndSession(body);
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

    async upgradeAnonymousUserToEmailAndPassword(userId: string, body: EmailAndPasswordLoginInterface): Promise<AuthResult> {
        const verifyResult = await this.verifyEmailAndPasswordValidity(body);

        if (verifyResult !== 'success') return verifyResult;
        else {
            try {
                const upgradeAnonymousUserToEmailAndPasswordResult = await this.emailAndPasswordService.upgradeAnonymousUserToEmailAndPassword(
                    {
                        email: body.email,
                        password: body.password,
                        userId,
                    }
                );
                if (upgradeAnonymousUserToEmailAndPasswordResult['message'] === 'User is not anonymous')
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

    async upgradeAnonymousUserToSocial(userId: string, socialUser: SocialUser): Promise<AuthResult> {
        try {
            const anonymousUser = await this.findUserByUuid(userId);
            if (anonymousUser.isAnonymous) {
                switch (socialUser.provider) {
                    case 'google':
                        const googleUserSessionAndCSRF = await this.authenticateGoogleUser(socialUser);
                        googleUserSessionAndCSRF.result.user = await this.cleanUpOldUserData(
                            anonymousUser,
                            googleUserSessionAndCSRF.result.user
                        );
                        return googleUserSessionAndCSRF;
                    case 'facebook':
                        const facebookUserSessionAndCSRF = await this.authenticateFacebookUser(socialUser);
                        facebookUserSessionAndCSRF.result.user = await this.cleanUpOldUserData(
                            anonymousUser,
                            facebookUserSessionAndCSRF.result.user
                        );
                        return facebookUserSessionAndCSRF;
                }
            } else {
                return <AuthResult>{
                    apiCallResult: false,
                    result: { error: 'User is not anonymous' },
                };
            }
        } catch (e) {
            return <AuthResult>{
                apiCallResult: false,
                result: { error: 'Error determining social provider or anon uuid' },
            };
        }
    }

    async linkProviderToAccount(userId: string, providerData: any): Promise<AuthResult> {
        try {
            switch (providerData.provider) {
                case 'google':
                    return await this.linkGoogleProviderToAccount(userId, providerData);
                case 'facebook':
                    return await this.linkFacebookProviderToAccount(userId, providerData);
                case 'emailAndPassword':
                    return await this.linkEmailAndPasswordProviderToAccount(userId, providerData);
            }
        } catch (e) {
            return <AuthResult>{
                apiCallResult: false,
                result: { error: 'Error linking provider to account' },
            };
        }
    }

    private async linkGoogleProviderToAccount(userId: string, socialUser: SocialUser): Promise<AuthResult> {
        try {
            // verify the socialUser data is good
            const verifiedGoogleJWT = await this.googleService.verifyIdToken(socialUser.idToken);
            if (verifiedGoogleJWT === false) {
                const result: AuthResult = {
                    apiCallResult: false,
                    result: { error: 'Invalid JWT' },
                };
                return result;
            }
            // look up provider account by socialUid
            const googleProvider = await this.googleService.findGoogleProviderBySocialUid(socialUser.socialUid);
            const user: User = await this.findUserByUuid(userId);

            // if provider account does not exist, add provider to user data, update database, return updated user data
            if (googleProvider === undefined) {
                const updatedUser = await this.googleService.linkProviderToExistingAccount(user, socialUser);
                return {
                    apiCallResult: true,
                    result: {
                        user: updatedUser.user,
                        sessionToken: updatedUser.sessionToken,
                        csrfToken: updatedUser.csrfToken,
                    },
                };
            }

            const otherUserWithCurrentGoogleAccount = await this.googleService.findUserAccountByGoogleProviderId(googleProvider.id);
            user.googleProviderId = googleProvider.id;
            user.googleProvider = googleProvider;

            // check for conflicts, one provider at a time

            if (user.emailAndPasswordProviderId === null) {
                if (otherUserWithCurrentGoogleAccount.emailAndPasswordProviderId === null) {
                } else {
                    user.emailAndPasswordProviderId = otherUserWithCurrentGoogleAccount.emailAndPasswordProviderId;
                    user.emailAndPasswordProvider = otherUserWithCurrentGoogleAccount.emailAndPasswordProvider;
                }
            } else if (otherUserWithCurrentGoogleAccount.emailAndPasswordProviderId !== null) {
                if (user.emailAndPasswordProviderId !== otherUserWithCurrentGoogleAccount.emailAndPasswordProviderId) {
                    return { apiCallResult: false, result: { error: 'cannot merge accounts: emailAndPassword conflict' } };
                }
            }

            if (user.facebookProviderId === null) {
                if (otherUserWithCurrentGoogleAccount.facebookProviderId === null) {
                } else {
                    user.facebookProviderId = otherUserWithCurrentGoogleAccount.facebookProviderId;
                    user.facebookProvider = otherUserWithCurrentGoogleAccount.facebookProvider;
                }
            } else if (otherUserWithCurrentGoogleAccount.facebookProviderId !== null) {
                if (user.facebookProviderId !== otherUserWithCurrentGoogleAccount.facebookProviderId) {
                    return { apiCallResult: false, result: { error: 'cannot merge accounts: facebook conflict' } };
                }
            }

            const updatedUser = await this.cleanUpOldUserData(otherUserWithCurrentGoogleAccount, user);
            await this.userRepository.save(updatedUser);
            const userSessionAndCSRFToken = await this.googleService.loginGoogleUserSessionAndCSRF(updatedUser.googleProvider);

            return {
                apiCallResult: true,
                result: {
                    user: userSessionAndCSRFToken.user,
                    sessionToken: userSessionAndCSRFToken.sessionToken,
                    csrfToken: userSessionAndCSRFToken.csrfToken,
                },
            };
        } catch (e) {
            const result: AuthResult = {
                apiCallResult: false,
                result: { error: 'unknown error linking google provider to account' },
            };
            return result;
        }
    }

    private async linkFacebookProviderToAccount(userId: string, socialUser: SocialUser): Promise<AuthResult> {
        try {
            // verify the socialUser data is good
            const verifiedAccessToken = await this.facebookService.verifyAccessToken(socialUser.accessToken);
            if (
                verifiedAccessToken === false ||
                socialUser.email !== verifiedAccessToken['email'] ||
                socialUser.socialUid !== verifiedAccessToken['id']
            ) {
                const result: AuthResult = {
                    apiCallResult: false,
                    result: { error: 'Invalid Access Token' },
                };
                return result;
            }
            const facebookProvider = await this.facebookService.findFacebookProviderBySocialUid(socialUser.socialUid);
            const user: User = await this.findUserByUuid(userId);

            if (facebookProvider === undefined) {
                const updatedUser = await this.facebookService.linkProviderToExistingAccount(user, socialUser);

                const result: AuthResult = {
                    apiCallResult: true,
                    result: {
                        user: updatedUser.user,
                        csrfToken: updatedUser.csrfToken,
                        sessionToken: updatedUser.sessionToken,
                    },
                };
                return result;
            }

            const otherUserWithCurrentFacebookAccount = await this.facebookService.findUserAccountByFacebookProviderId(facebookProvider.id);
            user.facebookProviderId = facebookProvider.id;
            user.facebookProvider = facebookProvider;

            // check for conflicts, one provider at a time

            if (user.emailAndPasswordProviderId === null) {
                if (otherUserWithCurrentFacebookAccount.emailAndPasswordProviderId === null) {
                } else {
                    user.emailAndPasswordProviderId = otherUserWithCurrentFacebookAccount.emailAndPasswordProviderId;
                    user.emailAndPasswordProvider = otherUserWithCurrentFacebookAccount.emailAndPasswordProvider;
                }
            } else if (otherUserWithCurrentFacebookAccount.emailAndPasswordProviderId !== null) {
                if (user.emailAndPasswordProviderId !== otherUserWithCurrentFacebookAccount.emailAndPasswordProviderId) {
                    return { apiCallResult: false, result: { error: 'cannot merge accounts: emailAndPassword conflict' } };
                }
            }

            if (user.googleProviderId === null) {
                if (otherUserWithCurrentFacebookAccount.googleProviderId === null) {
                } else {
                    user.googleProviderId = otherUserWithCurrentFacebookAccount.googleProviderId;
                    user.googleProvider = otherUserWithCurrentFacebookAccount.googleProvider;
                }
            } else if (otherUserWithCurrentFacebookAccount.googleProviderId !== null) {
                if (user.googleProviderId !== otherUserWithCurrentFacebookAccount.googleProviderId) {
                    return { apiCallResult: false, result: { error: 'cannot merge accounts: google conflict' } };
                }
            }

            const updatedUser = await this.cleanUpOldUserData(otherUserWithCurrentFacebookAccount, user);
            await this.userRepository.save(updatedUser);
            const userSessionAndCSRFToken = await this.facebookService.loginFacebookUserSessionAndCSRF(updatedUser.facebookProvider);

            return {
                apiCallResult: true,
                result: {
                    user: userSessionAndCSRFToken.user,
                    sessionToken: userSessionAndCSRFToken.sessionToken,
                    csrfToken: userSessionAndCSRFToken.csrfToken,
                },
            };
        } catch (e) {
            const result: AuthResult = {
                apiCallResult: false,
                result: { error: 'unknown error linking facebook provider to account' },
            };
            return result;
        }
    }

    private async linkEmailAndPasswordProviderToAccount(userId: string, emailAndPasswordUser: EmailAndPasswordUser): Promise<AuthResult> {
        try {
            // look up user and provider, if provider doesn't exist, validate password,
            const user: User = await this.findUserByUuid(userId);
            const emailAndPasswordProvider = await this.emailAndPasswordService.findEmailAndPasswordProviderByEmail(
                emailAndPasswordUser.email
            );

            if (emailAndPasswordProvider === undefined) {
                const passwordErrors = this.emailAndPasswordService.validatePassword(emailAndPasswordUser.password);
                if (passwordErrors.length > 0) {
                    const result = {
                        apiCallResult: false,
                        result: { error: passwordErrors },
                    };
                    return result;
                }
                // create provider and add to user data, update database, return updated user data
                const updatedUser = await this.emailAndPasswordService.linkProviderToExistingAccount(user, {
                    email: emailAndPasswordUser.email,
                    password: emailAndPasswordUser.password,
                });

                const result: AuthResult = {
                    apiCallResult: true,
                    result: {
                        user: updatedUser.user,
                        csrfToken: updatedUser.csrfToken,
                        sessionToken: updatedUser.sessionToken,
                    },
                };
                return result;
            }

            // attempt to log in.
            const isPasswordValid = await this.securityService.verifyPasswordHash({
                passwordHash: emailAndPasswordProvider.passwordHash,
                password: emailAndPasswordUser.password,
            });

            // if unsuccessful return failure result
            if (!isPasswordValid) {
                const result = {
                    apiCallResult: false,
                    result: { error: 'Password Invalid' },
                };
                return result;
            }

            //if successful, assign successful details to current user
            const otherUserWithCurrentEmailAndPasswordAccount = await this.emailAndPasswordService.findUserAccountByEmailAndPasswordProviderId(
                emailAndPasswordProvider.id
            );
            user.emailAndPasswordProviderId = emailAndPasswordProvider.id;
            user.emailAndPasswordProvider = emailAndPasswordProvider;

            // check for conflicts, one provider at a time, adding provider details to main user if there are no conflicts.
            if (user.googleProviderId === null) {
                if (otherUserWithCurrentEmailAndPasswordAccount.googleProviderId === null) {
                } else {
                    user.googleProviderId = otherUserWithCurrentEmailAndPasswordAccount.googleProviderId;
                    user.googleProvider = otherUserWithCurrentEmailAndPasswordAccount.googleProvider;
                }
            } else if (otherUserWithCurrentEmailAndPasswordAccount.googleProviderId !== null) {
                if (user.googleProviderId !== otherUserWithCurrentEmailAndPasswordAccount.googleProviderId) {
                    return { apiCallResult: false, result: { error: 'cannot merge accounts: google conflict' } };
                }
            }

            if (user.facebookProviderId === null) {
                if (otherUserWithCurrentEmailAndPasswordAccount.facebookProviderId === null) {
                } else {
                    user.facebookProviderId = otherUserWithCurrentEmailAndPasswordAccount.facebookProviderId;
                    user.facebookProvider = otherUserWithCurrentEmailAndPasswordAccount.facebookProvider;
                }
            } else if (otherUserWithCurrentEmailAndPasswordAccount.facebookProviderId !== null) {
                if (user.facebookProviderId !== otherUserWithCurrentEmailAndPasswordAccount.facebookProviderId) {
                    return { apiCallResult: false, result: { error: 'cannot merge accounts: facebook conflict' } };
                }
            }

            const updatedUser = await this.cleanUpOldUserData(otherUserWithCurrentEmailAndPasswordAccount, user);
            await this.userRepository.save(updatedUser);
            const sessionAndCSRFToken = await this.emailAndPasswordService.loginAndCreateSession(
                { email: emailAndPasswordUser.email, password: emailAndPasswordUser.password },
                updatedUser
            );

            return {
                apiCallResult: true,
                result: {
                    user: updatedUser,
                    sessionToken: sessionAndCSRFToken.sessionToken,
                    csrfToken: sessionAndCSRFToken.csrfToken,
                },
            };
        } catch (e) {
            const result: AuthResult = {
                apiCallResult: false,
                result: { error: 'unknown error linking emailAndPassword provider to account' },
            };
            return result;
        }
    }

    private async cleanUpOldUserData(oldUser: User, existingUser: User): Promise<User> {
        // merge any data from oldUser into existingUser
        // i will likely add features to this function as i create data
        // for now there is nothing else to do but delete the old user
        this.userRepository.remove(oldUser);
        return existingUser;
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
                case 'google':
                    const googleProvider = await this.googleService.findGoogleProviderById(user.googleProviderId);
                    user.googleProvider = googleProvider;
                    return { apiCallResult: true, result: { user } };
                case 'facebook':
                    const facebookProvider = await this.facebookService.findFacebookProviderById(user.facebookProviderId);
                    user.facebookProvider = facebookProvider;
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

    async resetPassword({ password, token }: { password: string; token: string }): Promise<AuthResult> {
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
            const user = await this.emailAndPasswordService.findUserAccountByEmailAndPasswordProviderId(emailAndPasswordProvider.id);
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

    async changePassword(body: { oldPassword: string; newPassword: string }, jwt: UserJWT): Promise<AuthResult> {
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
            await this.emailAndPasswordService.updateEmailAndPasswordProvider(emailAndPasswordProvider);
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

            const providersToBeDeleted = [];
            userToBeDeleted.emailAndPasswordProviderId !== null ? providersToBeDeleted.push('emailAndPassword') : null;
            userToBeDeleted.facebookProviderId !== null ? providersToBeDeleted.push('facebook') : null;
            userToBeDeleted.googleProviderId !== null ? providersToBeDeleted.push('google') : null;

            await this.userRepository.remove(userToBeDeleted);

            providersToBeDeleted.forEach(async provider => {
                switch (provider) {
                    case 'emailAndPassword':
                        const emailProvider = await this.emailAndPasswordService.findEmailAndPasswordProviderById(
                            userToBeDeleted.emailAndPasswordProviderId
                        );
                        await this.emailAndPasswordService.removeEmailAndPasswordProvider(emailProvider);
                        break;
                    case 'facebook':
                        const facebookProvider = await this.facebookService.findFacebookProviderById(userToBeDeleted.facebookProviderId);
                        this.facebookService.revokeAccessToken(facebookProvider.accessToken);
                        await this.facebookService.removeFacebookProvider(facebookProvider);
                        break;
                    case 'google':
                        const googleProvider = await this.googleService.findGoogleProviderById(userToBeDeleted.googleProviderId);
                        this.googleService.revokeAccessToken(googleProvider.accessToken);
                        await this.googleService.removeGoogleProvider(googleProvider);
                        break;
                }
            });

            return { apiCallResult: true, result: {} };
        } catch (e) {
            return {
                apiCallResult: false,
                result: { error: 'error deleting account' },
            };
        }
    }
}
