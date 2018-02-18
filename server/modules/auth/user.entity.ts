import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { EmailAndPasswordProvider } from './email-and-password/email-and-password-provider.entity';
import { GoogleProvider } from './google/google-provider.entity';
import { FacebookProvider } from './facebook/facebook-provider.entity';

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
}
