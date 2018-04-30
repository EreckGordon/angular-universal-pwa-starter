import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class RefreshToken {
    @PrimaryColumn() refreshToken: string;

    @Column('bigint') expiration: number;

    @Column() owner: string; // uuid of user associated with refresh token.
}
