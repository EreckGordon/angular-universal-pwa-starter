import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../../auth/user.entity';
import { UserJWT } from '../../auth/interfaces/user-jwt.interface';
import { RefreshToken } from './refresh-token.entity';

const util = require('util');
import * as fs from 'fs';
import * as path from 'path';
const crypto = require('crypto');
import * as jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';

const randomBytes = util.promisify(crypto.randomBytes);
const signJwt = util.promisify(jwt.sign);

const RSA_PRIVATE_KEY = fs.readFileSync(path.join(process.cwd(), 'private.key'));
const RSA_PUBLIC_KEY = fs.readFileSync(path.join(process.cwd(), 'public.key'));

@Injectable()
export class SecurityService {
    constructor(@InjectRepository(RefreshToken) private readonly refreshTokenRepository: Repository<RefreshToken>) {}

    get publicRSAKey() {
        return RSA_PUBLIC_KEY;
    }

    async createCsrfToken() {
        return await randomBytes(32).then(bytes => bytes.toString('hex'));
    }

    async createRefreshToken(uuid: string) {
        const refreshToken: string = await randomBytes(16).then(bytes => bytes.toString('hex'));
        const refreshTokenEntity = new RefreshToken();
        refreshTokenEntity.refreshToken = refreshToken;
        refreshTokenEntity.owner = uuid;
        refreshTokenEntity.expiration = Date.now() + 1210000000; // 2 weeks in ms
        this.refreshTokenRepository.save(refreshTokenEntity);
        return refreshToken;
    }

    async checkRefreshToken(refreshToken: string, uuid: string): Promise<boolean> {
        try {
            const refreshTokenInDb = await this.refreshTokenRepository.findOne(refreshToken);
            const validOwner: boolean = refreshTokenInDb.owner === uuid;
            const validToken: boolean = refreshTokenInDb.expiration > Date.now();
            if (validOwner && validToken) return true;
            else {
                await this.refreshTokenRepository.remove(refreshTokenInDb);
                return false;
            }
        } catch(e){
            return false
        }
    }

    async deleteAllRefreshTokensAssociatedWithUser(uuid: string) {
        const associatedRefreshTokens = await this.refreshTokenRepository.find({
            where: {
                owner: uuid,
            },
        });
        if (associatedRefreshTokens !== undefined && associatedRefreshTokens.length > 0) {
            associatedRefreshTokens.forEach(token => this.refreshTokenRepository.remove(token));
        }
    }

    async createSessionToken({ roles, id, loginProvider, refreshToken = 'none' }) {
        if (refreshToken === 'none') {
            refreshToken = await this.createRefreshToken(id);
        }

        return await signJwt(
            {
                roles,
                loginProvider,
                refreshToken,
            },
            RSA_PRIVATE_KEY,
            {
                algorithm: 'RS256',
                expiresIn: '10m',
                subject: id,
            }
        );
    }

    async decodeJwt(token: string): Promise<UserJWT> {
        return await jwt.verify(token, RSA_PUBLIC_KEY, {
            ignoreExpiration: true,
        });
    }

    async createPasswordResetToken(email: string) {
        return await signJwt({ email }, RSA_PRIVATE_KEY, {
            algorithm: 'RS256',
            expiresIn: '10m',
            subject: 'password-reset-token',
        });
    }

    async decodePasswordResetToken(token: string) {
        try {
            return await jwt.verify(token, RSA_PUBLIC_KEY, {
                subject: 'password-reset-token',
            });
        } catch (e) {
            if (e.message === 'jwt expired') return e.message;
            else {
                return e;
            }
        }
    }

    async createPasswordHash({ password }: { password: string }) {
        return await argon2.hash(password);
    }

    async verifyPasswordHash({ passwordHash, password }) {
        return await argon2.verify(passwordHash, password);
    }
}
