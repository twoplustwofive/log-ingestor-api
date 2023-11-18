// src/app.module.ts
import { Module } from '@nestjs/common';
import { LogModule } from './log/log.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), LogModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
