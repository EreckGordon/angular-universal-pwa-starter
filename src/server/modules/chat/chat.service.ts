import { Component, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';

import { User } from '../auth/user.entity';
import { Chatroom } from './chatroom.entity';
import { Message } from './message.entity';
import { SecurityService } from '../common/security/security.service';
import { ChatCache } from './chat.cache';
import { UserJWT } from '../auth/interfaces/user-JWT.interface';

@Component()
export class ChatService {
    constructor(
        @Inject('ChatroomRepositoryToken') private readonly chatRepository: Repository<Chatroom>,
        @Inject('MessageRepositoryToken') private readonly messageRepository: Repository<Message>,
        @Inject('UserRepositoryToken') private readonly userRepository: Repository<User>,
        private readonly securityService: SecurityService,
        private readonly chatCache: ChatCache
    ) {}

    async findChatroomByName(roomName: string): Promise<Chatroom | undefined> {
        return this.chatRepository.findOne({ where: { name: roomName } });
    }

    async createChatroom(roomName: string, userJWT: UserJWT) {
        const user = await this.userRepository.findOne(userJWT.sub);
        //console.log(user)
        const chatroom = new Chatroom();
        chatroom.name = roomName;
        chatroom.ownedBy = user;
        chatroom.populatedBy = [user];
        this.chatRepository.save(chatroom);

        // may need to prune some of the info returned here before emitting. maybe handle that in the service?
        return chatroom;
    }

    async addMessage(messageData: { roomName: string; message: string }, userJWT: UserJWT) {}
}
