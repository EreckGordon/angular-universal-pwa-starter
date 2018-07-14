import { Chatroom } from '../chatroom.entity';
import { Message } from '../message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

export const chatProviders = [TypeOrmModule.forFeature([Chatroom]), TypeOrmModule.forFeature([Message])];
