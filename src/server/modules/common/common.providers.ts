import { Connection, Repository } from 'typeorm';
import { RefreshToken } from './security/refresh-token.entity';

export const commonProviders = [
    {
        provide: 'RefreshTokenRepositoryToken',
        useFactory: (connection: Connection) => connection.getRepository(RefreshToken),
        inject: ['DbConnectionToken'],
    },
];
