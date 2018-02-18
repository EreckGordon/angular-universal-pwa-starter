import { Component, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import FB from 'fb';

import { environment } from '../../../../src/environments/environment';

import { User } from '../user.entity';
import { FacebookProvider } from './facebook-provider.entity';
import { SecurityService } from '../../common/security/security.service';

@Component()
export class FacebookService {
    constructor(
        @Inject('UserRepositoryToken') private readonly userRepository: Repository<User>,
        @Inject('FacebookProviderRepositoryToken')
        private readonly facebookProviderRepository: Repository<FacebookProvider>,
        private readonly securityService: SecurityService
    ) {}

    async verifyAccessToken(accessToken: string) {
        try {
            const verifiedAccessToken = await FB.api('me', {
                access_token: accessToken,
                fields: 'id,email',
            });
            return verifiedAccessToken;
        } catch (e) {
            return false;
        }
    }

    async findFacebookProviderBySocialUid(socialUid) {
        return await this.facebookProviderRepository.findOne({
            where: { socialUid },
        });
    }

    async createFacebookUser() {
        console.log('create facebook user');
    }

    async loginFacebookUser() {
        console.log('login facebook user');
    }
}
