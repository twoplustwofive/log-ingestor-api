import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LogDto } from './dto/log.dto';
import { Log } from './schemas/log.schema';
import { generateRandomLogData } from '../common/util';

@Injectable()
export class LogService {
  constructor(@InjectModel(Log.name) private readonly logModel: Model<Log>) {}

  create(logDto: LogDto) {
    const createdLog = new this.logModel(logDto);
    return createdLog.save();
  }

  async getLogs(filters: any): Promise<Log[]> {
    const filter: any = {};
    const paginationOptions = {
      pageCount: filters.pageCount || 10,
      pageNumber: filters.pageNumber || 1,
    };

    const regexOptions = 'i';

    if (filters.level) {
      filter.level = {
        $regex: new RegExp(escapeRegex(filters.level), regexOptions),
      };
    }

    if (filters.message) {
      filter.message = {
        $regex: new RegExp(escapeRegex(filters.message), regexOptions),
      };
    }

    if (filters.resourceId) {
      filter.resourceId = {
        $regex: new RegExp(escapeRegex(filters.resourceId), regexOptions),
      };
    }

    if (filters.startTime) {
      filter.timestamp = { $gte: filters.startTime };
    }

    if (filters.endTime) {
      filter.timestamp = { ...(filter.timestamp || {}), $lte: filters.endTime };
    }

    if (filters.traceId) {
      filter.traceId = {
        $regex: new RegExp(escapeRegex(filters.traceId), regexOptions),
      };
    }

    if (filters.spanId) {
      filter.spanId = {
        $regex: new RegExp(escapeRegex(filters.spanId), regexOptions),
      };
    }

    if (filters.commit) {
      filter.commit = {
        $regex: new RegExp(escapeRegex(filters.commit), regexOptions),
      };
    }

    if (filters.parentResourceId) {
      filter['metadata.parentResourceId'] = {
        $regex: new RegExp(escapeRegex(filters.parentResourceId), regexOptions),
      };
    }

    const logs = await this.logModel
      .find(filter)
      .skip((paginationOptions.pageNumber - 1) * paginationOptions.pageCount)
      .limit(paginationOptions.pageCount)
      .exec();

    return logs;
  }

  async getLogsCount(filters: any): Promise<number> {
    const filter: any = {};

    const regexOptions = 'i';

    if (filters.level) {
      filter.level = {
        $regex: new RegExp(escapeRegex(filters.level), regexOptions),
      };
    }

    if (filters.message) {
      filter.message = {
        $regex: new RegExp(escapeRegex(filters.message), regexOptions),
      };
    }

    if (filters.resourceId) {
      filter.resourceId = {
        $regex: new RegExp(escapeRegex(filters.resourceId), regexOptions),
      };
    }

    if (filters.startTime) {
      filter.timestamp = { $gte: filters.startTime };
    }

    if (filters.endTime) {
      filter.timestamp = { ...(filter.timestamp || {}), $lte: filters.endTime };
    }

    if (filters.traceId) {
      filter.traceId = {
        $regex: new RegExp(escapeRegex(filters.traceId), regexOptions),
      };
    }

    if (filters.spanId) {
      filter.spanId = {
        $regex: new RegExp(escapeRegex(filters.spanId), regexOptions),
      };
    }

    if (filters.commit) {
      filter.commit = {
        $regex: new RegExp(escapeRegex(filters.commit), regexOptions),
      };
    }

    if (filters.parentResourceId) {
      filter['metadata.parentResourceId'] = {
        $regex: new RegExp(escapeRegex(filters.parentResourceId), regexOptions),
      };
    }

    const logsCount = await this.logModel.countDocuments(filter).exec();

    return logsCount;
  }

  async getLogByTraceId(traceId: string): Promise<Log | null> {
    return this.logModel.findOne({ traceId }).exec();
  }

  async deleteLogByTraceId(traceId: string): Promise<void> {
    await this.logModel.deleteOne({ traceId }).exec();
  }

  async createBatchLogsBetween2021And2022() {
    const startDate = new Date('2021-01-01T00:00:00Z');
    const endDate = new Date('2022-01-01T00:00:00Z');

    let currentTimestamp = startDate.getTime();
    const logs = [];

    while (currentTimestamp < endDate.getTime()) {
      const logData = generateRandomLogData(
        new Date(currentTimestamp).toISOString(),
      );

      logs.push(logData);

      // Increment timestamp by 1 minute
      currentTimestamp += 60 * 1000;
    }

    await this.logModel.insertMany(logs);
  }

  async deleteAllLogs() {
    await this.logModel.deleteMany({});
  }
}

export function escapeRegex(text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
