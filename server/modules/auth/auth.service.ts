import { Component, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { EmailAndPasswordProvider } from './email-and-password-provider.entity';


const util = require('util');
import * as fs from "fs";
import * as path from 'path';
const crypto = require('crypto');
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import * as passwordValidator from 'password-validator';


const randomBytes = util.promisify(crypto.randomBytes);
const signJwt = util.promisify(jwt.sign);

const RSA_PRIVATE_KEY = fs.readFileSync(path.join(process.cwd(), 'private.key'))
const RSA_PUBLIC_KEY = fs.readFileSync(path.join(process.cwd(), 'public.key'))

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
        @Inject('EmailAndPasswordProviderRepositoryToken') private readonly emailAndPasswordProviderRepository: Repository<EmailAndPasswordProvider>
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

    get publicRSAKey() {
        return RSA_PUBLIC_KEY;
    }

    async findUserByEmail(email: string): Promise<User> {
        let currentProvider: EmailAndPasswordProvider = await this.emailAndPasswordProviderRepository.findOne({
            where: { email },
            cache: true // default 1000 = 1 second
        });

        if (currentProvider === undefined) return Promise.resolve(undefined);

        return await this.userRepository.findOne({
            where: { emailAndPasswordProviderId: currentProvider.id },
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
            const passwordHash = await argon2.hash(credentials.password);
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
        const isPasswordValid = await argon2.verify(emailProvider.passwordHash, credentials.password);
        if (!isPasswordValid) {
            throw new Error("Password Invalid");
        }
        return this.createSessionToken(user);
    }

    async createCsrfToken() {
        return await randomBytes(32).then(bytes => bytes.toString("hex"));
    }

    async createSessionToken(user: User) {
        return await signJwt({
            roles: user.roles
        },
            RSA_PRIVATE_KEY, {
                algorithm: 'RS256',
                expiresIn: '2h',
                subject: user.id.toString()
            });
    }

    async decodeJwt(token: string) {
        const payload = await jwt.verify(token, RSA_PUBLIC_KEY);
        return payload;
    }

    validatePassword(password: string) {
        const schema = new passwordValidator();
        schema
            .is().min(10)
            .is().not().oneOf(['Passw0rd', 'Password123']);
        return schema.validate(password, { list: true });
    }

}
