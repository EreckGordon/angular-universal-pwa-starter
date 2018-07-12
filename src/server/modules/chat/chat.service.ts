import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../auth/user.entity';
import { Chatroom } from './chatroom.entity';
import { Message } from './message.entity';
import { SecurityService } from '../common/security/security.service';
import { ChatCache } from './chat.cache';
import { UserJWT } from '../auth/interfaces/user-JWT.interface';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chatroom) private readonly chatRepository: Repository<Chatroom>,
        @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly securityService: SecurityService,
        private readonly chatCache: ChatCache
    ) {}

    async findChatroomByName(roomName: string): Promise<Chatroom | undefined> {
        return this.chatRepository.findOne({ where: { name: roomName } });
    }

    async createChatroom(roomName: string, userJWT: UserJWT) {
        const user = await this.userRepository.findOne(userJWT.sub);
        // console.log(user)
        const chatroom = new Chatroom();
        chatroom.name = roomName;
        chatroom.ownedBy = user;
        chatroom.populatedBy = [user];
        this.chatRepository.save(chatroom);

        // may need to prune some of the info returned here before emitting. maybe handle that in the service?
        return chatroom;
    }

    async addMessage(messageData: { roomName: string; message: string }, userJWT: UserJWT) {
        const user = await this.userRepository.findOne(userJWT.sub);
        const room = await this.findChatroomByName(messageData.roomName);

        const message = new Message();
        message.chatroom = room;
        message.createdDate = new Date();
        message.message = messageData.message;
        message.user = user;
        this.messageRepository.save(message);

        return message;
    }
}
