export class ResponseBuilder {
  static buildResponse(data: any, message: string, statusCode: number) {
    return { data, message, statusCode };
  }
}
