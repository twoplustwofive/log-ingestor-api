import {
  Controller,
  Post,
  Body,
  Query,
  Get,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Delete,
} from '@nestjs/common';
import { LogDto } from './dto/log.dto';
import { LogService } from './log.service';
import { ResponseBuilder } from '../common/response-builder.util';
import { validate } from 'class-validator';

@Controller('logs')
@UsePipes(new ValidationPipe())
export class LogController {
  constructor(private readonly logService: LogService) {}

  private async validateLogDto(logDto: LogDto) {
    const errors = await validate(logDto);
    if (errors.length > 0) {
      throw new HttpException(
        ResponseBuilder.buildResponse(
          errors,
          'Validation failed',
          HttpStatus.BAD_REQUEST,
        ),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post()
  async createLog(@Body() logDto: LogDto) {
    try {
      await this.validateLogDto(logDto);

      const log = this.logService.create(logDto);

      const response = ResponseBuilder.buildResponse(
        log,
        'Log created successfully',
        HttpStatus.CREATED,
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async getLogs(@Query() filters: any) {
    try {
      const logs = await this.logService.getLogs(filters);

      const response = ResponseBuilder.buildResponse(
        logs,
        'Logs retrieved successfully',
        HttpStatus.OK,
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Get('count')
  async getLogsCount(@Query() filters: any) {
    try {
      const logsCount = await this.logService.getLogsCount(filters);

      const response = ResponseBuilder.buildResponse(
        logsCount,
        'Log count retrieved successfully',
        HttpStatus.OK,
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Post('create-batch-logs')
  async createBatchLogs() {
    await this.logService.createBatchLogsBetween2021And2023();

    const response = ResponseBuilder.buildResponse(
      null,
      'Batch logs created successfully.',
      HttpStatus.OK,
    );
    return response;
  }

  @Delete('delete-all-logs')
  deleteAllLogs() {
    this.logService.deleteAllLogs();

    const response = ResponseBuilder.buildResponse(
      null,
      'All logs deleted successfully.',
      HttpStatus.OK,
    );
    return response;
  }
}
