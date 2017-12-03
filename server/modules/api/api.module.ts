import { Module, NestModule, MiddlewaresConsumer, RequestMethod } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { ArticleModule } from '../article/article.module';

import { APIService } from './api.service';
import { APIController } from './api.controller';
import { checkCSRFTokenMiddleware, checkIfAuthenticatedMiddleware, RetrieveUserIdFromRequestMiddleware } from '../common/middlewares'

@Module({
    modules: [AuthModule, ArticleModule],
    components: [APIService],
    controllers: [APIController]
})
export class APIModule implements NestModule {
    configure(consumer: MiddlewaresConsumer): void {
        consumer.apply([RetrieveUserIdFromRequestMiddleware]).forRoutes(APIController);
        consumer.apply([checkIfAuthenticatedMiddleware, checkCSRFTokenMiddleware]).forRoutes(
            { path: '/logout', method: RequestMethod.ALL }
        );
    }
}
