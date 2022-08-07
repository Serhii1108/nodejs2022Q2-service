import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const { method, url, body, params } = request;

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();

      const { message: exceptionMessage, name: errorName } = exception;

      const message = `${method} ${statusCode} ${url} params:${JSON.stringify(
        params,
      )} body:${JSON.stringify(body)} message:"${exceptionMessage}"`;

      Logger.error(message);

      response.status(statusCode).json({
        statusCode,
        message: exceptionMessage,
        error: errorName,
      });
    } else {
      const statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      const exceptionMessage = 'Internal Server Error';

      const message = `${method} ${statusCode} ${url} params:${JSON.stringify(
        params,
      )} body:${JSON.stringify(body)} message:"${exceptionMessage}"`;

      Logger.error(message);

      response.status(statusCode).json({
        statusCode,
        message: exceptionMessage,
      });
    }
  }
}
