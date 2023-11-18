import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LogDto } from './dto/log.dto';
import { Log } from './schemas/log.schema';
import { generateFilter, generateRandomLogData } from '../common/util';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class LogService {
  constructor(@InjectModel(Log.name) private readonly logModel: Model<Log>) {}
  private globalQueue: LogDto[] = [];

  addToGlobalQueue(logDto: any) {
    this.globalQueue.push(logDto);
  }

  @Cron(CronExpression.EVERY_SECOND)
  async processGlobalQueue() {
    const batchSize = 5000;
    const logsToProcess = this.globalQueue.splice(0, batchSize);

    if (logsToProcess.length > 0) {
      console.log(`Processing ${logsToProcess.length} logs:`, new Date());
      await this.logModel.insertMany(logsToProcess);
    }
  }

  create(logDto: LogDto) {
    this.addToGlobalQueue(logDto);
  }

  async getLogs(filters: any): Promise<Log[]> {
    const filter = generateFilter(filters);

    const paginationOptions = {
      pageCount: filters.pageCount || 10,
      pageNumber: filters.pageNumber || 1,
    };

    const logs = await this.logModel
      .find(filter)
      .skip((paginationOptions.pageNumber - 1) * paginationOptions.pageCount)
      .limit(paginationOptions.pageCount)
      .exec();

    return logs;
  }

  async getLogsCount(filters: any): Promise<number> {
    const filter = generateFilter(filters);

    const logsCount = await this.logModel.countDocuments(filter).exec();

    return logsCount;
  }

  async getLogByTraceId(traceId: string): Promise<Log | null> {
    return this.logModel.findOne({ traceId }).exec();
  }

  async deleteLogByTraceId(traceId: string): Promise<void> {
    await this.logModel.deleteOne({ traceId }).exec();
  }

  async createBatchLogsBetween2021And2023() {
    const startDate = new Date('2021-01-01T00:00:00Z');
    const endDate = new Date('2023-01-01T00:00:00Z');

    let currentTimestamp = startDate.getTime();

    while (currentTimestamp < endDate.getTime()) {
      const logData = generateRandomLogData(
        new Date(currentTimestamp).toISOString(),
      );

      this.addToGlobalQueue(logData);

      currentTimestamp += 60 * 1000;
    }
  }

  async deleteAllLogs() {
    await this.logModel.deleteMany({});
  }
}
