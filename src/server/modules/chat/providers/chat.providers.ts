import { Connection, Repository } from 'typeorm';
import { Chatroom } from '../chatroom.entity';
import { Message } from '../message.entity';

export const chatProviders = [
    {
        provide: 'ChatroomRepositoryToken',
        useFactory: (connection: Connection) => connection.getRepository(Chatroom),
        inject: ['DbConnectionToken'],
    },
    {
        provide: 'MessageRepositoryToken',
        useFactory: (connection: Connection) => connection.getRepository(Message),
        inject: ['DbConnectionToken'],
    },
];
