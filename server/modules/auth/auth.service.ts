import { Component, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { EmailAndPasswordProvider } from './email-and-password/email-and-password-provider.entity';
import { SecurityService } from '../common/security/security.service';

import * as passwordValidator from 'password-validator';


interface SessionAndCSRFToken {
    sessionToken: string;
    csrfToken: string;
}

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
        @Inject('UserRepositoryToken') private readonly userRepository: Repository<User>,
        @Inject('EmailAndPasswordProviderRepositoryToken') private readonly emailAndPasswordProviderRepository: Repository<EmailAndPasswordProvider>,
        private readonly securityService: SecurityService
    ) { }

    async loginEmailAndPasswordUser(body): Promise<AuthResult> {

        const credentials = body;

        const user = await this.findUserByEmail(credentials.email);

        const userExists = user === undefined ? false : true;

        if (!userExists) {
            const result: AuthResult = { apiCallResult: false, result: { error: 'user does not exist' } }
            return result
        }

        else {
            try {
                const loginResult = await this.loginAndCreateSession(credentials, user);
                if (loginResult["message"] === "Password Invalid") throw new Error("Password Invalid");
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
                const result: AuthResult = { apiCallResult: false, result: { error: "Password Invalid" } }
                return result
            }
        }

    }

    async createEmailAndPasswordUser(body): Promise<AuthResult> {

        const credentials = body;

        const usernameTaken = await this.emailTaken(credentials.email)

        if (usernameTaken) {
            const result: AuthResult = { apiCallResult: false, result: { error: 'Email already in use' } }
            return result
        }

        const passwordErrors = this.validatePassword(credentials.password);

        if (passwordErrors.length > 0) {
            const result: AuthResult = { apiCallResult: false, result: { error: passwordErrors } }
            return result;
        }

        else {
            try {
                const createUserResult = await this.createEmailAndPasswordUserAndSession(credentials);
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
                const result: AuthResult = { apiCallResult: false, result: { error: 'Error creating new user' } }
                return result
            }

        }

    }

    async findUserByEmail(email: string): Promise<User> {
        let currentProvider: EmailAndPasswordProvider = await this.emailAndPasswordProviderRepository.findOne({
            where: { email },
            cache: true // default 1000 = 1 second
        });

        if (currentProvider === undefined) return Promise.resolve(undefined);

        return await this.userRepository.findOne({
            where: { emailAndPasswordProviderId: currentProvider.id },
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

    async createEmailAndPasswordUserAndSession(credentials) {
        try {
            const passwordHash = await this.securityService.createPasswordHash({ password: credentials.password });
            const user = await this.addEmailAndPasswordUserToDatabase(credentials.email, passwordHash);
            const sessionToken = await this.createSessionToken(user);
            const csrfToken = await this.createCsrfToken();
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
            const csrfToken = await this.createCsrfToken();
            const result: SessionAndCSRFToken = { sessionToken, csrfToken }
            return result
        }
        catch (err) {
            return err
        }
    }

    async findEmailProviderById(providerId: number) {
        return await this.emailAndPasswordProviderRepository.findOne({
            where: { id: providerId },
            cache: true
        });
    }

    async attemptLoginWithEmailAndPassword(credentials: any, user: User) {
        let emailProvider = await this.findEmailProviderById(user.emailAndPasswordProviderId)
        const isPasswordValid = await this.securityService.verifyPasswordHash({ passwordHash: emailProvider.passwordHash, password: credentials.password });
        if (!isPasswordValid) {
            throw new Error("Password Invalid");
        }
        return this.createSessionToken(user);
    }

    createCsrfToken() {
        return this.securityService.createCsrfToken();
    }

    createSessionToken(user: User) {
        return this.securityService.createSessionToken({ roles: user.roles, id: user.id.toString() });
    }

    decodeJwt(token: string) {
        return this.securityService.decodeJwt(token);
    }

    validatePassword(password: string) {
        const schema = new passwordValidator();
        schema
            .is().min(10)
            .is().not().oneOf(['Passw0rd', 'Password123']);
        return schema.validate(password, { list: true });
    }

}
