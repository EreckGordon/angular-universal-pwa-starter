import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './article.entity';

export const articleProviders = [
    TypeOrmModule.forFeature([Article])
];
