import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { articleProviders } from './article.providers';
import { ArticleService } from './article.service';

@Module({
    imports: [DatabaseModule, ...articleProviders],
    providers: [ArticleService],
    exports: [ArticleService],
})
export class ArticleModule {}
