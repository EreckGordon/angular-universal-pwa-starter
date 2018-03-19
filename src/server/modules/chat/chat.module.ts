import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { authProviders } from '../auth/providers/auth.providers';
import { chatProviders } from './providers/chat.providers';
import { ChatService } from './chat.service';
import { ChatGateway } from './gateways/chat.gateway';
import { ChatCache } from './chat.cache';

import { CommonModule } from '../common/common.module';

@Module({
    modules: [CommonModule, DatabaseModule],
    components: [...chatProviders, ...authProviders, ChatService, ChatGateway, ChatCache],
})
export class ChatModule {}
