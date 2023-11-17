import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogController } from './log.controller';
import { LogService } from './log.service';
import { Log, LogSchema } from './schemas/log.schema';
import { mongooseConfig } from '../mongoose.config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => mongooseConfig,
    }),
    MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
  ],
  controllers: [LogController],
  providers: [LogService],
})
export class LogModule {}
