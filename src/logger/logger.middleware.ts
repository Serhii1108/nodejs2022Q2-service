import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      const { method, originalUrl, body, params } = req;
      const { statusCode, statusMessage } = res;

      const message = `${method} ${statusCode} ${originalUrl} params:${JSON.stringify(
        params,
      )} body:${JSON.stringify(body)} message:"${statusMessage}"`;

      if (statusCode < 400) {
        Logger.log(message);
      }
    });

    next();
  }
}
