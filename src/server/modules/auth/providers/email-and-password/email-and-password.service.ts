import { Component, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as passwordValidator from 'password-validator';

import { User } from '../../user.entity';
import { EmailAndPasswordProvider } from './email-and-password-provider.entity';
import { SecurityService } from '../../../common/security/security.service';
import { UserSessionAndCSRFToken } from '../../interfaces/user-session-and-csrfToken.interface';
import { SessionAndCSRFToken } from '../../interfaces/session-and-csrfToken.interface';
import { EmailAndPasswordLoginInterface } from '../../interfaces/email-and-password-login.interface';

@Component()
export class EmailAndPasswordService {
    constructor(
        @Inject('UserRepositoryToken') private readonly userRepository: Repository<User>,
        @Inject('EmailAndPasswordProviderRepositoryToken')
        private readonly emailAndPasswordProviderRepository: Repository<EmailAndPasswordProvider>,
        private readonly securityService: SecurityService
    ) {}

    async findUserByEmail(email: string): Promise<User> {
        let currentProvider: EmailAndPasswordProvider = await this.findEmailAndPasswordProviderByEmail(email);
        if (currentProvider === undefined) return Promise.resolve(undefined);
        return this.findUserAccountByEmailAndPasswordProviderId(currentProvider.id);
    }

    async findEmailAndPasswordProviderById(providerId: number) {
        return await this.emailAndPasswordProviderRepository.findOne({
            where: { id: providerId },
            cache: true,
        });
    }

    async findEmailAndPasswordProviderByEmail(email: string) {
        return await this.emailAndPasswordProviderRepository.findOne({
            where: { email },
        });
    }

    async findUserAccountByEmailAndPasswordProviderId(id) {
        return await this.userRepository.findOne({
            where: { emailAndPasswordProviderId: id },
            relations: ['emailAndPasswordProvider'],
        });
    }

    async emailTaken(email: string): Promise<boolean> {
        return (await this.findUserByEmail(email)) === undefined ? false : true;
    }

    async addEmailAndPasswordUserToDatabase(email: string, passwordHash: string): Promise<User> {
        const emailAndPasswordProvider = new EmailAndPasswordProvider();
        emailAndPasswordProvider.email = email;
        emailAndPasswordProvider.passwordHash = passwordHash;
        const user = new User();
        user.isAnonymous = false;
        user.roles = ['user'];
        user.emailAndPasswordProvider = emailAndPasswordProvider;
        return await this.userRepository.save(user);
    }

    async linkProviderToExistingAccount(
        user: User,
        emailAndPasswordUser: EmailAndPasswordLoginInterface,
        refreshToken: string
    ): Promise<UserSessionAndCSRFToken> {
        const updatedUser: User = user;
        const emailAndPasswordProvider = new EmailAndPasswordProvider();
        emailAndPasswordProvider.email = emailAndPasswordUser.email;
        emailAndPasswordProvider.passwordHash = await this.securityService.createPasswordHash({ password: emailAndPasswordUser.password });
        updatedUser.emailAndPasswordProvider = emailAndPasswordProvider;
        await this.userRepository.save(updatedUser);
        const sessionToken = await this.securityService.createSessionToken({
            roles: updatedUser.roles,
            id: updatedUser.id,
            loginProvider: 'emailAndPassword',
            refreshToken,
        });
        const csrfToken = await this.securityService.createCsrfToken();
        const result = { user: updatedUser, sessionToken, csrfToken };
        return result;
    }

    async createEmailAndPasswordUserAndSession(credentials: EmailAndPasswordLoginInterface): Promise<UserSessionAndCSRFToken> {
        try {
            const passwordHash = await this.securityService.createPasswordHash({
                password: credentials.password,
            });
            const user: User = await this.addEmailAndPasswordUserToDatabase(credentials.email, passwordHash);
            const sessionToken = await this.securityService.createSessionToken({
                roles: user.roles,
                id: user.id,
                loginProvider: 'emailAndPassword',
            });
            const csrfToken = await this.securityService.createCsrfToken();
            const result = { user, sessionToken, csrfToken };
            return result;
        } catch (err) {
            return err;
        }
    }

    async loginAndCreateSession(credentials: EmailAndPasswordLoginInterface, user: User): Promise<SessionAndCSRFToken> {
        try {
            const sessionToken = await this.attemptLoginWithEmailAndPassword(credentials, user);
            const csrfToken = await this.securityService.createCsrfToken();
            const result: SessionAndCSRFToken = { sessionToken, csrfToken };
            return result;
        } catch (err) {
            return err;
        }
    }

    async attemptLoginWithEmailAndPassword(credentials: EmailAndPasswordLoginInterface, user: User) {
        let emailProvider = await this.findEmailAndPasswordProviderById(user.emailAndPasswordProviderId);
        const isPasswordValid = await this.securityService.verifyPasswordHash({
            passwordHash: emailProvider.passwordHash,
            password: credentials.password,
        });
        if (!isPasswordValid) {
            throw new Error('Password Invalid');
        }
        return this.securityService.createSessionToken({
            roles: user.roles,
            id: user.id,
            loginProvider: 'emailAndPassword',
        });
    }

    async upgradeAnonymousUserToEmailAndPassword({
        email,
        password,
        userId,
        refreshToken,
    }: {
        email: string;
        password: string;
        userId: string;
        refreshToken: string;
    }) {
        try {
            const passwordHash = await this.securityService.createPasswordHash({
                password,
            });
            const user = await this.upgradeAnonymousUserInDatabase({
                email,
                passwordHash,
                userId,
            });
            const sessionToken = await this.securityService.createSessionToken({
                roles: user.roles,
                id: user.id,
                loginProvider: 'emailAndPassword',
                refreshToken,
            });
            const csrfToken = await this.securityService.createCsrfToken();
            const result = { user, sessionToken, csrfToken };
            return result;
        } catch (err) {
            return err;
        }
    }

    async upgradeAnonymousUserInDatabase({ email, passwordHash, userId }) {
        const user = await this.userRepository.findOne(userId);
        if (!user.isAnonymous) throw new Error('User is not anonymous');
        const emailAndPasswordProvider = new EmailAndPasswordProvider();
        emailAndPasswordProvider.email = email;
        emailAndPasswordProvider.passwordHash = passwordHash;
        user.isAnonymous = false;
        user.roles = ['user'];
        user.emailAndPasswordProvider = emailAndPasswordProvider;
        return await this.userRepository.save(user);
    }

    async removeEmailAndPasswordProvider(provider) {
        await this.emailAndPasswordProviderRepository.remove(provider);
    }

    async updateEmailAndPasswordProvider(provider) {
        this.emailAndPasswordProviderRepository.save(provider);
    }

    validatePassword(password: string) {
        const schema = new passwordValidator();
        schema
            .is()
            .min(10)
            .is()
            .not()
            .oneOf(['Passw0rd', 'Password123']);
        return schema.validate(password, { list: true });
    }
}
