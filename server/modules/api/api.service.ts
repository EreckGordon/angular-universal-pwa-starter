import { Component } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { ArticleService } from '../article/article.service';

@Component()
export class APIService {
  constructor(
  	private readonly authService: AuthService, 
  	private readonly articleService:ArticleService
  ) {}


}