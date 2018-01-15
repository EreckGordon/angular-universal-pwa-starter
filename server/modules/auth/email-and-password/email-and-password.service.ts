import { Component, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { EmailAndPasswordProvider } from './email-and-password-provider.entity';
import { SecurityService } from '../../common/security/security.service';

import * as passwordValidator from 'password-validator';


interface SessionAndCSRFToken {
    sessionToken: string;
    csrfToken: string;
}

interface UserSessionAndCSRFToken {
    user: User;
    sessionToken: string;
    csrfToken: string
}


@Component()
export class EmailAndPasswordService {
    constructor (
        @Inject('UserRepositoryToken') private readonly userRepository: Repository<User>,
        @Inject('EmailAndPasswordProviderRepositoryToken') private readonly emailAndPasswordProviderRepository: Repository<EmailAndPasswordProvider>,
        private readonly securityService: SecurityService
    ) { }

    async findUserByEmail(email: string): Promise<User> {
        let currentProvider: EmailAndPasswordProvider = await this.findEmailAndPasswordProviderByEmail(email);
        if (currentProvider === undefined) return Promise.resolve(undefined);
        return this.findUserAccountByEmailAndPasswordProviderId(currentProvider.id)
    }

    async findEmailAndPasswordProviderById(providerId: number) {
        return await this.emailAndPasswordProviderRepository.findOne({
            where: { id: providerId },
            cache: true
        });
    }

    async findEmailAndPasswordProviderByEmail(email: string) {
        return await this.emailAndPasswordProviderRepository.findOne({
            where: { email }
        });
    }

    async findUserAccountByEmailAndPasswordProviderId(id) {
        return await this.userRepository.findOne({
            where: { emailAndPasswordProviderId: id },
            relations: ["emailAndPasswordProvider"],
            cache: true
        });
    }

    async emailTaken(email: string): Promise<boolean> {
        return await this.findUserByEmail(email) === undefined ? false : true;

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

    async createEmailAndPasswordUserAndSession(credentials): Promise<UserSessionAndCSRFToken> {
        try {
            const passwordHash = await this.securityService.createPasswordHash({ password: credentials.password });
            const user: User = await this.addEmailAndPasswordUserToDatabase(credentials.email, passwordHash);
            const sessionToken = await this.securityService.createSessionToken({ roles: user.roles, id: user.id.toString(), loginProvider: 'emailAndPassword' });
            const csrfToken = await this.securityService.createCsrfToken();
            const result = { user, sessionToken, csrfToken };
            return result;
        }
        catch (err) {
            return err
        }
    }

    async loginAndCreateSession(credentials: any, user: User): Promise<SessionAndCSRFToken> {
        try {
            const sessionToken = await this.attemptLoginWithEmailAndPassword(credentials, user);
            const csrfToken = await this.securityService.createCsrfToken();
            const result: SessionAndCSRFToken = { sessionToken, csrfToken }
            return result
        }
        catch (err) {
            return err
        }
    }

    async attemptLoginWithEmailAndPassword(credentials: any, user: User) {
        let emailProvider = await this.findEmailAndPasswordProviderById(user.emailAndPasswordProviderId)
        const isPasswordValid = await this.securityService.verifyPasswordHash({ passwordHash: emailProvider.passwordHash, password: credentials.password });
        if (!isPasswordValid) {
            throw new Error("Password Invalid");
        }
        return this.securityService.createSessionToken({ roles: user.roles, id: user.id, loginProvider: 'emailAndPassword' });
    }

    async upgradeAnonymousUserToEmailAndPassword({ email, password, userId }: { email: string, password: string, userId: string }) {
        try {
            const passwordHash = await this.securityService.createPasswordHash({ password });
            const user = await this.upgradeAnonymousUserInDatabase({ email, passwordHash, userId });
            const sessionToken = await this.securityService.createSessionToken({ roles: user.roles, id: user.id, loginProvider: 'emailAndPassword' });
            const csrfToken = await this.securityService.createCsrfToken();
            const result = { user, sessionToken, csrfToken };
            return result;
        }
        catch (err) {
            return err
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

    validatePassword(password: string) {
        const schema = new passwordValidator();
        schema
            .is().min(10)
            .is().not().oneOf(['Passw0rd', 'Password123']);
        return schema.validate(password, { list: true });
    }

}
