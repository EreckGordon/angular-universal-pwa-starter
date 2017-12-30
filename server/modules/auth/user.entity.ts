import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { EmailAndPasswordProvider } from './email-and-password-provider.entity';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdDate: Date;

    @Column()
    isAnonymous: boolean;

    @Column('simple-array')
    roles: string[];

    @OneToOne(type => EmailAndPasswordProvider, { cascade: true })
    @JoinColumn()
    emailAndPasswordProvider: EmailAndPasswordProvider;

}
