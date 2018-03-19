import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../auth/user.entity';
import { Chatroom } from './chatroom.entity';

@Entity()
export class Message {
    @PrimaryGeneratedColumn() id: number;

    @CreateDateColumn() createdDate: Date;

    @ManyToOne(type => User, user => user.messages)
    user: User;

    @ManyToOne(type => Chatroom, chatroom => chatroom.messages)
    chatroom: Chatroom;

    @Column() content: string;
}
