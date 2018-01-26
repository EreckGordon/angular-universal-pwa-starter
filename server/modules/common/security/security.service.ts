import { Component } from '@nestjs/common';
import { User } from '../../auth/user.entity';

const util = require('util');
import * as fs from "fs";
import * as path from 'path';
const crypto = require('crypto');
import * as jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';

const randomBytes = util.promisify(crypto.randomBytes);
const signJwt = util.promisify(jwt.sign);

const RSA_PRIVATE_KEY = fs.readFileSync(path.join(process.cwd(), 'private.key'))
const RSA_PUBLIC_KEY = fs.readFileSync(path.join(process.cwd(), 'public.key'))


@Component()
export class SecurityService {
    constructor () { }

    get publicRSAKey() {
        return RSA_PUBLIC_KEY;
    }

    async createCsrfToken() {
        return await randomBytes(32).then(bytes => bytes.toString("hex"));
    }

    async createSessionToken({ roles, id, loginProvider }) {
        return await signJwt({
            roles,
            loginProvider
        },
            RSA_PRIVATE_KEY, {
                algorithm: 'RS256',
                expiresIn: '2h',
                subject: id
            });
    }

    async decodeJwt(token: string) {
        return await jwt.verify(token, RSA_PUBLIC_KEY, { ignoreExpiration: true });
    }

    async createPasswordResetToken() {
        return await signJwt({}, RSA_PRIVATE_KEY, { algorithm: 'RS256', expiresIn: '10m', subject: 'password-reset-token' })
    }

    async decodePasswordResetToken(token: string) {
        return await jwt.verify(token, RSA_PUBLIC_KEY, { subject: 'password-reset-token' });
    }

    async createPasswordHash({ password }) {
        return await argon2.hash(password);
    }

    async verifyPasswordHash({ passwordHash, password }) {
        return await argon2.verify(passwordHash, password);
    }

}
