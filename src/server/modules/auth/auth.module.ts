import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { AuthController } from './auth.controller';
import { authProviders } from './providers/auth.providers';
import { AuthService } from './auth.service';
import { EmailAndPasswordService } from './providers/email-and-password/email-and-password.service';
import { GoogleService } from './providers/google/google.service';
import { FacebookService } from './providers/facebook/facebook.service';
import { AnonymousService } from './providers/anonymous/anonymous.service';
import { AuthGateway } from './gateways/auth.gateway';
import { AuthCache } from './auth.cache';

import { CommonModule } from '../common/common.module';
import { checkCSRFTokenMiddleware, RetrieveUserIdFromRequestMiddleware } from '../common/middlewares';

@Module({
    imports: [CommonModule, DatabaseModule, ...authProviders],
    providers: [AuthService, EmailAndPasswordService, AnonymousService, GoogleService, FacebookService, AuthGateway, AuthCache],
    controllers: [AuthController],
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(RetrieveUserIdFromRequestMiddleware).forRoutes(AuthController);
        consumer
            .apply(checkCSRFTokenMiddleware)
            .forRoutes(
                { path: '/api/auth/reauthenticate', method: RequestMethod.ALL },
                { path: '/api/auth/logout', method: RequestMethod.ALL },
                { path: '/api/auth/link-provider-to-account', method: RequestMethod.ALL },
                { path: '/api/auth/delete-account', method: RequestMethod.ALL },
                { path: '/api/auth/change-password', method: RequestMethod.ALL }
            );
    }
}
