import { Module } from '@nestjs/common';

import { APIModule } from './api/api.module';
import { AppController } from './app.controller';


@Module({
    modules: [APIModule],
    controllers: [AppController]
})
export class ApplicationModule {}