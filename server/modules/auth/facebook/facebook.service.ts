import { Component, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';

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
}
