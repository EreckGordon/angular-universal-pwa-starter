import { Component, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';

import { User } from '../user.entity';
import { GoogleProvider } from './google-provider.entity';
import { SecurityService } from '../../common/security/security.service';

@Component()
export class GoogleService {
    constructor(
        @Inject('UserRepositoryToken') private readonly userRepository: Repository<User>,
        @Inject('GoogleProviderRepositoryToken')
        private readonly googleProviderRepository: Repository<GoogleProvider>,
        private readonly securityService: SecurityService
    ) {}
}
