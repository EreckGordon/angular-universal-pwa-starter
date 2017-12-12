import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';

import { HelloWorldController } from './hello-world.controller';

@Module({
    modules: [AuthModule],
    controllers: [
        AppController,
        HelloWorldController
    ]
})
export class ApplicationModule { }
