import { NestFactory } from '@nestjs/core';

import * as bodyParser from 'body-parser';

import { ApplicationModule } from './modules/app.module';


async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  app.use(bodyParser.json());
  await app.listen(8000);
}

bootstrap();