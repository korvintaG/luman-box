import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ServerErrorExceptionFilter } from './filters/server-error.filter';
import { trimSlashesAndPoints } from './utils/utils';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
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
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
