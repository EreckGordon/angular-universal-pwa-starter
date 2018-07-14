import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Message } from './message.entity';
import { User } from '../auth/user.entity';

@Entity()
export class Chatroom {
    @PrimaryGeneratedColumn() id: number;

    @Column({ unique: true })
    name: string;

    @ManyToMany(type => User)
    @JoinTable()
    populatedBy: User[];

    @OneToMany(type => Message, message => message.user)
    messages: Message[];

    @ManyToOne(type => User, user => user.chatroomOwner)
    ownedBy: User;
}
