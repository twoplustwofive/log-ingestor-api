import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class LogDto {
  @IsNotEmpty()
  @IsString()
  level: string;

  @IsNotEmpty()
  @IsDateString()
  timestamp: Date;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  resourceId?: string;

  @IsOptional()
  @IsString()
  traceId?: string;

  @IsOptional()
  @IsString()
  spanId?: string;

  @IsOptional()
  @IsString()
  commit?: string;

  @IsOptional()
  metadata?: { parentResourceId: string };
}
