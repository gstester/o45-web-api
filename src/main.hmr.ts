import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { SwaggerConfiguration } from './app.swagger';


declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.info("Starting qc-catalog api");

  app.enableCors();

  SwaggerConfiguration.configure(app);
  
  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
