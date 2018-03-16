import { createConnection } from 'typeorm';

export const databaseProviders = [
    {
        provide: 'DbConnectionToken',
        useFactory: async () =>
            await createConnection({
                type: 'postgres',
                host: 'localhost',
                port: +process.env.POSTGRES_PORT || 5432,
                username: process.env.POSTGRES_USERNAME || 'postgres',
                password: process.env.POSTGRES_PASSWORD || 'testingpass',
                database: process.env.POSTGRES_DATABASE || 'testingDB',
                entities: [__dirname + '/../**/**.entity{.ts,.js}'],
                synchronize: true,
                logging: false,
                cache: true,
            }),
    },
];
