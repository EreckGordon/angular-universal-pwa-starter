import { Module } from '@nestjs/common';

import { APIModule } from './api/api.module';


@Module({
    modules: [APIModule],
})
export class ApplicationModule {}