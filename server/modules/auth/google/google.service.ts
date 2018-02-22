import { Component, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as GoogleAuthLibrary from 'google-auth-library';

import { environment } from '../../../../src/environments/environment';
import { SocialUser } from '../../../../src/app/shared/auth/social-module/classes/social-user.class';

import { User } from '../user.entity';
import { GoogleProvider } from './google-provider.entity';
import { SecurityService } from '../../common/security/security.service';
import { UserSessionAndCSRFToken } from '../interfaces/user-session-and-csrfToken.interface';

@Component()
export class GoogleService {
    private googleOAuth2 = new GoogleAuthLibrary.OAuth2Client();
    constructor(
        @Inject('UserRepositoryToken') private readonly userRepository: Repository<User>,
        @Inject('GoogleProviderRepositoryToken') private readonly googleProviderRepository: Repository<GoogleProvider>,
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

    async findUserAccountByGoogleProviderId(id) {
        return await this.userRepository.findOne({
            where: { googleProviderId: id },
            relations: ['googleProvider'],
            cache: true,
        });
    }

    async findGoogleProviderById(providerId: number) {
        return await this.googleProviderRepository.findOne({
            where: { id: providerId },
            cache: true,
        });
    }

    async createGoogleUserSessionAndCSRF(socialUser: SocialUser): Promise<UserSessionAndCSRFToken> {
        try {
            const user: User = await this.addGoogleUserToDatabase(socialUser);
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

    private async addGoogleUserToDatabase(socialUser: SocialUser): Promise<User> {
        const googleProvider = new GoogleProvider();
        googleProvider.accessToken = socialUser.accessToken;
        googleProvider.email = socialUser.email;
        googleProvider.idToken = socialUser.idToken;
        googleProvider.name = socialUser.name;
        googleProvider.photoUrl = socialUser.photoUrl;
        googleProvider.socialUid = socialUser.socialUid;
        const user = new User();
        user.isAnonymous = false;
        user.roles = ['user'];
        user.googleProvider = googleProvider;
        return await this.userRepository.save(user);
    }

    async loginGoogleUserSessionAndCSRF(googleProvider: GoogleProvider): Promise<UserSessionAndCSRFToken> {
        const user: User = await this.findUserAccountByGoogleProviderId(googleProvider.id);
        const sessionToken = await this.securityService.createSessionToken({
            roles: user.roles,
            id: user.id,
            loginProvider: 'google',
        });
        const csrfToken = await this.securityService.createCsrfToken();
        const result = { user, sessionToken, csrfToken };
        return result;
    }

    async linkProviderToExistingAccount(user: User, socialUser: SocialUser): Promise<UserSessionAndCSRFToken> {
        const updatedUser: User = user;
        const googleProvider = new GoogleProvider();
        googleProvider.accessToken = socialUser.accessToken;
        googleProvider.email = socialUser.email;
        googleProvider.idToken = socialUser.idToken;
        googleProvider.name = socialUser.name;
        googleProvider.photoUrl = socialUser.photoUrl;
        googleProvider.socialUid = socialUser.socialUid;
        updatedUser.googleProvider = googleProvider;
        await this.userRepository.save(updatedUser);
        const sessionToken = await this.securityService.createSessionToken({
            roles: updatedUser.roles,
            id: updatedUser.id,
            loginProvider: 'google',
        });
        const csrfToken = await this.securityService.createCsrfToken();
        const result = { user: updatedUser, sessionToken, csrfToken };
        return result;
    }
}
