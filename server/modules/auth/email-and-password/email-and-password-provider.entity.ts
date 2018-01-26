import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class EmailAndPasswordProvider {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    passwordHash: string;

    @Column({ nullable: true })
    passwordResetToken: string;

}
