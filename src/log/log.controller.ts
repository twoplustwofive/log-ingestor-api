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
} from '@nestjs/common';
import { LogDto } from './dto/log.dto';
import { LogService } from './log.service';
import { ResponseBuilder } from 'src/common/response-builder.service';
import { validate } from 'class-validator';

@Controller('logs')
@UsePipes(new ValidationPipe())
export class LogController {
  constructor(
    private readonly logService: LogService,
    private readonly responseBuilder: ResponseBuilder,
  ) {}

  private async validateLogDto(logDto: LogDto) {
    const errors = await validate(logDto);
    if (errors.length > 0) {
      throw new HttpException(
        this.responseBuilder.buildResponse(
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

      await this.logService.create(logDto);

      const response = this.responseBuilder.buildResponse(
        null,
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

      const response = this.responseBuilder.buildResponse(
        logs,
        'Logs retrieved successfully',
        HttpStatus.OK,
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}
