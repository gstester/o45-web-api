import { Module } from '@nestjs/common';

import { configurationProvider } from './app.provider';
import { O45Module } from './app/o45.module';

@Module({
  imports: [O45Module],
  providers: [configurationProvider]
})
export class AppModule {}
