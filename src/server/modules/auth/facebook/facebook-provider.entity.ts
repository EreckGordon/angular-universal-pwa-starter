import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class FacebookProvider {
    @PrimaryGeneratedColumn() id: number;

    @Column() email: string;

    @Column() name: string;

    @Column() photoUrl: string;

    @Column() socialUid: string;

    @Column() accessToken: string;
}
