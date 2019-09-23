require('dotenv').config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { SwaggerConfiguration } from './app.swagger';
import { SummaryEntry } from './app/models/summary';
export const port : number = 3000;


SummaryEntry.test();

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.enableCors();

  SwaggerConfiguration.configure(app);
  
  await app.listen(port);
}

bootstrap();
