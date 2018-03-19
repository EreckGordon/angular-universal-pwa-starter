import { Component, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';

import { User } from '../auth/user.entity';
import { Chatroom } from './chatroom.entity';
import { Message } from './message.entity';
import { SecurityService } from '../common/security/security.service';
import { ChatCache } from './chat.cache';

@Component()
export class ChatService {
    constructor(
        @Inject('ChatroomRepositoryToken') private readonly chatRepository: Repository<Chatroom>,
        @Inject('MessageRepositoryToken') private readonly messageRepository: Repository<Message>,
        @Inject('UserRepositoryToken') private readonly userRepository: Repository<User>,
        private readonly securityService: SecurityService,
        private readonly chatCache: ChatCache
    ) {}
}
