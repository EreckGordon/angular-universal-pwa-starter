import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { authProviders } from './auth.providers';
import { AuthService } from './auth.service';


@Module({
    modules: [DatabaseModule],
    components: [
        ...authProviders,
        AuthService
    ],
    exports: [AuthService]
})
export class AuthModule { }
