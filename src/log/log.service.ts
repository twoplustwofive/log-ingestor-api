import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LogDto } from './dto/log.dto';
import { Log } from './schemas/log.schema';

@Injectable()
export class LogService {
  constructor(@InjectModel(Log.name) private readonly logModel: Model<Log>) {}

  create(logDto: LogDto) {
    const createdLog = new this.logModel(logDto);
    return createdLog.save();
  }

  async getLogs(filters: any): Promise<Log[]> {
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

    const logs = await this.logModel.find(filter).exec();
    return logs;
  }
}

export function escapeRegex(text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
