import { Module } from '@nestjs/common';

import { APIModule } from './api/api.module';
import { AuthModule } from './auth/auth.module';


@Module({
    modules: [APIModule, AuthModule],
})
export class ApplicationModule {}