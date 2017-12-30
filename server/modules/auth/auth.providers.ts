import { Connection, Repository } from 'typeorm';
import { User } from './user.entity';
import { EmailAndPasswordProvider } from './email-and-password-provider.entity';

export const authProviders = [
    {
        provide: 'UserRepositoryToken',
        useFactory: (connection: Connection) => connection.getRepository(User),
        inject: ['DbConnectionToken'],
    },
];
