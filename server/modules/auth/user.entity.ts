import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { EmailAndPasswordProvider } from './email-and-password/email-and-password-provider.entity';

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    createdDate: Date;

    @Column()
    isAnonymous: boolean;

    @Column('simple-array')
    roles: string[];

    @Column({ nullable: true })
    emailAndPasswordProviderId: number;

    @OneToOne(type => EmailAndPasswordProvider, { cascade: true })
    @JoinColumn()
    emailAndPasswordProvider: EmailAndPasswordProvider;

}
