import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LogDto } from './dto/log.dto';
import { Log } from './schemas/log.schema';
import { generateRandomLogData, getRegexForOperator } from '../common/util';

@Injectable()
export class LogService {
  constructor(@InjectModel(Log.name) private readonly logModel: Model<Log>) {}

  private generateFilter(filters: any): any {
    const filter: any = {};
    const regexOptions = 'i';
    const logicalOperator = filters.combinator === 'or' ? '$or' : '$and';

    if (filters.startTime) {
      filter.timestamp = { $gte: filters.startTime };
    }

    if (filters.endTime) {
      filter.timestamp = { ...(filter.timestamp || {}), $lte: filters.endTime };
    }

    filter[logicalOperator] = [
      {
        level: {
          $regex: new RegExp(
            getRegexForOperator(filters.level, filters.levelOperator),
            regexOptions,
          ),
        },
      },
      {
        message: {
          $regex: new RegExp(
            getRegexForOperator(filters.message, filters.messageOperator),
            regexOptions,
          ),
        },
      },
      {
        resourceId: {
          $regex: new RegExp(
            getRegexForOperator(filters.resourceId, filters.resourceIdOperator),
            regexOptions,
          ),
        },
      },
      {
        traceId: {
          $regex: new RegExp(
            getRegexForOperator(filters.traceId, filters.traceIdOperator),
            regexOptions,
          ),
        },
      },
      {
        spanId: {
          $regex: new RegExp(
            getRegexForOperator(filters.spanId, filters.spanIdOperator),
            regexOptions,
          ),
        },
      },
      {
        commit: {
          $regex: new RegExp(
            getRegexForOperator(filters.commit, filters.commitOperator),
            regexOptions,
          ),
        },
      },
      {
        'metadata.parentResourceId': {
          $regex: new RegExp(
            getRegexForOperator(
              filters.parentResourceId,
              filters.parentResourceIdOperator,
            ),
            regexOptions,
          ),
        },
      },
    ];
    return filter;
  }

  create(logDto: LogDto) {
    const createdLog = new this.logModel(logDto);
    return createdLog.save();
  }

  async getLogs(filters: any): Promise<Log[]> {
    const filter = this.generateFilter(filters);

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
    const filter = this.generateFilter(filters);

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
