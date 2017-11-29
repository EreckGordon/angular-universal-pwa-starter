import { Module, NestModule, MiddlewaresConsumer } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { ArticleModule } from '../article/article.module';

import { APIService } from './api.service';
import { APIController } from './api.controller';
import { RetrieveUserIdFromRequestMiddleware } from './middlewares/retreive-user-id-from-request.middleware';


@Module({
  modules: [AuthModule, ArticleModule],
  components: [APIService],
  controllers: [APIController]
})
export class APIModule implements NestModule {
	configure(consumer:MiddlewaresConsumer): void {
		consumer.apply([RetrieveUserIdFromRequestMiddleware]).forRoutes(APIController)
	}
}