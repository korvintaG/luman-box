import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {ServerErrorExceptionFilter} from './filters/server-error.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({transform: true, whitelist: true}));
  app.useGlobalFilters(new ServerErrorExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
