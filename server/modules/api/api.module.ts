import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { apiProviders } from './api.providers';
import { APIService } from './api.service';


@Module({
  modules: [DatabaseModule],
  components: [
  	...apiProviders,
  	APIService
  ],
})
export class APIModule {}