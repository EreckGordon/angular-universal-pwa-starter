import { Component, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import FB from 'fb';

import { environment } from '../../../../src/environments/environment';
import { SocialUser } from '../../../../src/app/shared/auth/social-module/classes/social-user.class';

import { User } from '../user.entity';
import { FacebookProvider } from './facebook-provider.entity';
import { SecurityService } from '../../common/security/security.service';
import { UserSessionAndCSRFToken } from '../interfaces/user-session-and-csrfToken.interface';

@Component()
export class FacebookService {
    constructor(
        @Inject('UserRepositoryToken') private readonly userRepository: Repository<User>,
        @Inject('FacebookProviderRepositoryToken') private readonly facebookProviderRepository: Repository<FacebookProvider>,
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

    async findUserAccountByFacebookProviderId(id) {
        return await this.userRepository.findOne({
            where: { facebookProviderId: id },
            relations: ['facebookProvider'],
        });
    }

    async findFacebookProviderById(providerId: number) {
        return await this.facebookProviderRepository.findOne({
            where: { id: providerId },
            cache: true,
        });
    }

    async createFacebookUserSessionAndCSRF(socialUser: SocialUser): Promise<UserSessionAndCSRFToken> {
        try {
            const user: User = await this.addFacebookUserToDatabase(socialUser);
            const sessionToken = await this.securityService.createSessionToken({
                roles: user.roles,
                id: user.id,
                loginProvider: socialUser.provider,
            });
            const csrfToken = await this.securityService.createCsrfToken();
            const result = { user, sessionToken, csrfToken };
            return result;
        } catch (err) {
            return err;
        }
    }

    private async addFacebookUserToDatabase(socialUser: SocialUser): Promise<User> {
        const facebookProvider = new FacebookProvider();
        facebookProvider.accessToken = socialUser.accessToken;
        facebookProvider.email = socialUser.email;
        facebookProvider.name = socialUser.name;
        facebookProvider.photoUrl = socialUser.photoUrl;
        facebookProvider.socialUid = socialUser.socialUid;
        const user = new User();
        user.isAnonymous = false;
        user.roles = ['user'];
        user.facebookProvider = facebookProvider;
        return await this.userRepository.save(user);
    }

    async loginFacebookUserSessionAndCSRF(facebookProvider: FacebookProvider): Promise<UserSessionAndCSRFToken> {
        const user: User = await this.findUserAccountByFacebookProviderId(facebookProvider.id);
        const sessionToken = await this.securityService.createSessionToken({
            roles: user.roles,
            id: user.id,
            loginProvider: 'facebook',
        });
        const csrfToken = await this.securityService.createCsrfToken();
        const result = { user, sessionToken, csrfToken };
        return result;
    }

    async linkProviderToExistingAccount(user: User, socialUser: SocialUser): Promise<UserSessionAndCSRFToken> {
        const updatedUser: User = user;
        const facebookProvider = new FacebookProvider();
        facebookProvider.accessToken = socialUser.accessToken;
        facebookProvider.email = socialUser.email;
        facebookProvider.name = socialUser.name;
        facebookProvider.photoUrl = socialUser.photoUrl;
        facebookProvider.socialUid = socialUser.socialUid;
        updatedUser.facebookProvider = facebookProvider;
        await this.userRepository.save(updatedUser);
        const sessionToken = await this.securityService.createSessionToken({
            roles: updatedUser.roles,
            id: updatedUser.id,
            loginProvider: 'facebook',
        });
        const csrfToken = await this.securityService.createCsrfToken();
        const result = { user: updatedUser, sessionToken, csrfToken };
        return result;
    }

    async removeFacebookProvider(provider) {
        await this.facebookProviderRepository.remove(provider);
    }

    async revokeAccessToken(accessToken: string) {
        return await FB.api('me/permissions', 'delete', {
            access_token: accessToken,
        });
    }
}
