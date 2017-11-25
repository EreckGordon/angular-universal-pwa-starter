import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { ArticleModule } from '../article/article.module';

import { APIService } from './api.service';
import { APIController } from './api.controller';


@Module({
  modules: [AuthModule, ArticleModule],
  components: [APIService],
  controllers: [APIController]
})
export class APIModule {}