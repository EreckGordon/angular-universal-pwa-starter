import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class GoogleProvider {
    @PrimaryGeneratedColumn() id: number;

    @Column() email: string;

    @Column() name: string;

    @Column() photoUrl: string;

    @Column() socialUid: string;

    @Column() idToken: string;

    @Column() accessToken: string;
}
