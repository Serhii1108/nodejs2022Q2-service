import {
  ArgumentsHost,
  Catch,
  ExceptionFilter as DefFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class ExceptionFilter implements DefFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode = exception.getStatus();
    const { method, url, body } = request;

    const message = `${method} ${statusCode} ${url} body:${JSON.stringify(
      body,
    )}`;

    if (statusCode >= 500) {
      Logger.error(message);
      response.status(statusCode).json({
        status: statusCode,
        message: 'Internal server error',
      });
    }
  }
}
