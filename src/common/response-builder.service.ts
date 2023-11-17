import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseBuilder {
  buildResponse(data: any, message: string, statusCode: number) {
    return { data, message, statusCode };
  }
}
