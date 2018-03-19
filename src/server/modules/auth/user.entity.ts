import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn, OneToMany, ManyToMany } from 'typeorm';
import { EmailAndPasswordProvider } from './providers/email-and-password/email-and-password-provider.entity';
import { GoogleProvider } from './providers/google/google-provider.entity';
import { FacebookProvider } from './providers/facebook/facebook-provider.entity';
import { Message } from '../chat/message.entity';
import { Chatroom } from '../chat/chatroom.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid') id: string;

    @CreateDateColumn() createdDate: Date;

    @Column() isAnonymous: boolean;

    @Column('simple-array') roles: string[];

    @Column({ nullable: true })
    emailAndPasswordProviderId: number;

    @OneToOne(type => EmailAndPasswordProvider, { cascade: true })
    @JoinColumn()
    emailAndPasswordProvider: EmailAndPasswordProvider;

    @Column({ nullable: true })
    googleProviderId: number;

    @OneToOne(type => GoogleProvider, { cascade: true })
    @JoinColumn()
    googleProvider: GoogleProvider;

    @Column({ nullable: true })
    facebookProviderId: number;

    @OneToOne(type => FacebookProvider, { cascade: true })
    @JoinColumn()
    facebookProvider: FacebookProvider;

    @ManyToMany(type => Chatroom, chatroom => chatroom.populatedBy)
    chatrooms: Chatroom[];

    @OneToMany(type => Message, message => message.user)
    messages: Message[];

    //@OneToMany(type => Chatroom, chatroom => chatroom.ownedBy)
    //chatroomOwner: Chatroom[];
}
