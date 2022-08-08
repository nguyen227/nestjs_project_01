import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('Request');

  use(req: any, res: any, next: (error?: any) => void) {
    const { method, originalUrl } = req;

    const { statusCode } = res;

    this.logger.log(
      `${method} ${originalUrl} ${statusCode} - BODY: ${JSON.stringify(
        req.body,
      )} - PARAM: ${JSON.stringify(req.params)}`,
    );

    next();
  }
}
