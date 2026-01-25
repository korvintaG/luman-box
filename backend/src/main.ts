import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ServerErrorExceptionFilter } from './filters/server-error.filter';
import { trimSlashesAndPoints } from './utils/utils';
import { RateLimitInterceptor } from './interceptors/rate-limit.interceptor';
import { requestSizeLimitMiddleware } from './middleware/request-size-limit.middleware';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { LogMiddleware } from './middleware/request-log.middleware';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('HTTP');

    // Настройка лимитов запросов (исключаем Telegram webhook)
  app.use((req: Request, res: Response, next: NextFunction) => {
    return requestSizeLimitMiddleware(req, res, next);
  });

  app.use((req: Request, res: Response, next: NextFunction) => 
    new LogMiddleware().use(req, res, next));
 
  // RateLimitInterceptor requires ConfigService, so we need to get it from the app
  const configService = app.get(ConfigService);
  app.useGlobalInterceptors(new RateLimitInterceptor(configService));
  
  app.setGlobalPrefix('api');
  setupSwagger(app);
  app.useStaticAssets(
    join(__dirname, '..', process.env.UPLOAD_FILE_PATH),
      {prefix: `/${process.env.UPLOAD_FILE_PATH}/`},
  );
  app.useStaticAssets(
    join(__dirname, '..', process.env.STORE_FILE_PATH),
      {prefix: `/${process.env.STORE_FILE_PATH}/`},
  );
  app.enableCors({ origin: true, credentials: true });
  //["http://localhost:3006","192.168.50.151"]
  
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new ServerErrorExceptionFilter());
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
