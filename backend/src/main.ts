import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {ServerErrorExceptionFilter} from './filters/server-error.filter'
const cookieParser = require('cookie-parser');


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({ origin: true, credentials: true });
  app.use(cookieParser());
  //["http://localhost:3006","192.168.50.151"]
  app.useGlobalPipes(new ValidationPipe({transform: true, whitelist: true}));
  app.useGlobalFilters(new ServerErrorExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
