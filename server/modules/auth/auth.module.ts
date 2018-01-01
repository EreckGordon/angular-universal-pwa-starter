import { Module, NestModule, MiddlewaresConsumer, RequestMethod } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { AuthController } from './auth.controller';
import { authProviders } from './auth.providers';
import { AuthService } from './auth.service';
import { EmailAndPasswordService } from './email-and-password/email-and-password.service';

import { CommonModule } from '../common/common.module';
import { checkCSRFTokenMiddleware, checkIfAuthenticatedMiddleware, RetrieveUserIdFromRequestMiddleware } from '../common/middlewares';


@Module({
    modules: [
        CommonModule,
        DatabaseModule
    ],
    components: [
        ...authProviders,
        AuthService,
        EmailAndPasswordService
    ],
    controllers: [AuthController],
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewaresConsumer): void {
        consumer.apply([RetrieveUserIdFromRequestMiddleware]).forRoutes(AuthController);
        consumer.apply([checkIfAuthenticatedMiddleware, checkCSRFTokenMiddleware]).forRoutes(
            { path: '/logout', method: RequestMethod.ALL }
        );
    }
}
