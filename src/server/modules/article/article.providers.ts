import { Connection, Repository } from 'typeorm';
import { Article } from './article.entity';

export const articleProviders = [
    {
        provide: 'ArticleRepositoryToken',
        useFactory: (connection: Connection) => connection.getRepository(Article),
        inject: ['DbConnectionToken'],
    },
];
