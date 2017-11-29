import { Component, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Article } from './article.entity';

@Component()
export class ArticleService {
  constructor(
    @Inject('ArticleRepositoryToken') private readonly articleRepository: Repository<Article>
    ) {}

  async findAllArticles(): Promise<Article[]> {
    return await this.articleRepository.find();
  }

  async findArticleById(id:string){
    return await this.articleRepository.findOne(id)
  }

  async createArticle(title:string, slug:string, content:string){
	const article = new Article();
	article.title = title;
	article.slug = slug;
	article.content = content;
	return await this.articleRepository.save(article)
  }

}