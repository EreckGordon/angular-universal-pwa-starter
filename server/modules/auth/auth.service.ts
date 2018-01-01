import { Component } from '@nestjs/common';

import { User } from './user.entity';
import { EmailAndPasswordService } from './email-and-password/email-and-password.service';

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
    constructor (private readonly emailAndPasswordService: EmailAndPasswordService) { }

    async loginEmailAndPasswordUser(body): Promise<AuthResult> {

        const credentials = body;
        const user = await this.emailAndPasswordService.findUserByEmail(credentials.email);
        const userExists = user === undefined ? false : true;

        if (!userExists) {
            const result: AuthResult = { apiCallResult: false, result: { error: 'user does not exist' } }
            return result
        }

        else {
            try {
                const loginResult = await this.emailAndPasswordService.loginAndCreateSession(credentials, user);
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

        const usernameTaken = await this.emailAndPasswordService.emailTaken(credentials.email)

        if (usernameTaken) {
            const result: AuthResult = { apiCallResult: false, result: { error: 'Email already in use' } }
            return result
        }

        const passwordErrors = this.emailAndPasswordService.validatePassword(credentials.password);

        if (passwordErrors.length > 0) {
            const result: AuthResult = { apiCallResult: false, result: { error: passwordErrors } }
            return result;
        }

        else {
            try {
                const createUserResult = await this.emailAndPasswordService.createEmailAndPasswordUserAndSession(credentials);
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

}
