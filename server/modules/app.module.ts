import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';

@Module({
    modules: [AuthModule],
    controllers: [AppController],
})
export class ApplicationModule {}
