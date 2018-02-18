import { Component, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as GoogleAuthLibrary from 'google-auth-library';

import { environment } from '../../../../src/environments/environment';

import { User } from '../user.entity';
import { GoogleProvider } from './google-provider.entity';
import { SecurityService } from '../../common/security/security.service';

@Component()
export class GoogleService {
    private googleOAuth2 = new GoogleAuthLibrary.OAuth2Client();
    constructor(
        @Inject('UserRepositoryToken') private readonly userRepository: Repository<User>,
        @Inject('GoogleProviderRepositoryToken')
        private readonly googleProviderRepository: Repository<GoogleProvider>,
        private readonly securityService: SecurityService
    ) {}

    async verifyIdToken(idToken: string) {
        try {
            const verifiedIdToken = await this.googleOAuth2.verifyIdToken({
                idToken,
                audience: environment.googleLoginProvider,
            });
            return verifiedIdToken.getAttributes().payload;
        } catch (e) {
            return false;
        }
    }

    async findGoogleProviderBySocialUid(socialUid: string) {
        return await this.googleProviderRepository.findOne({
            where: { socialUid },
        });
    }

    async createGoogleUser() {
        console.log('create google user');
    }

    async loginGoogleUser() {
        console.log('login google user');
    }
}
