import { Connection, Repository } from 'typeorm';
import { User } from '../user.entity';
import { EmailAndPasswordProvider } from './email-and-password/email-and-password-provider.entity';
import { GoogleProvider } from './google/google-provider.entity';
import { FacebookProvider } from './facebook/facebook-provider.entity';

export const authProviders = [
    {
        provide: 'UserRepositoryToken',
        useFactory: (connection: Connection) => connection.getRepository(User),
        inject: ['DbConnectionToken'],
    },
    {
        provide: 'EmailAndPasswordProviderRepositoryToken',
        useFactory: (connection: Connection) => connection.getRepository(EmailAndPasswordProvider),
        inject: ['DbConnectionToken'],
    },
    {
        provide: 'GoogleProviderRepositoryToken',
        useFactory: (connection: Connection) => connection.getRepository(GoogleProvider),
        inject: ['DbConnectionToken'],
    },
    {
        provide: 'FacebookProviderRepositoryToken',
        useFactory: (connection: Connection) => connection.getRepository(FacebookProvider),
        inject: ['DbConnectionToken'],
    },
];
