// src/app.module.ts
import { Module } from '@nestjs/common';
import { LogModule } from './log/log.module';

@Module({
  imports: [LogModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
