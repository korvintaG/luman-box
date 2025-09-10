import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { join } from 'path';
import { loginAllRoles } from 'src/authorization/tests/auth.helpers';
import { ValidationPipe } from '@nestjs/common';

export const setupTestApp = async (isPartial: boolean = false): Promise<{
  app: NestExpressApplication;
  server: any;
  tokenUser?: string;
  tokenUser2?: string;
  tokenAdmin?: string;
  tokenSuperAdmin?: string;
}> => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { logger: false });
  app.setGlobalPrefix('api');
  // Добавьте валидацию, как в main.ts
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));


  const uploadDir = process.env.UPLOAD_FILE_PATH || 'dbimages';
  const storeDir = process.env.STORE_FILE_PATH || 'uploads';

  app.useStaticAssets(
    join(process.cwd(), uploadDir),
    { prefix: `/${uploadDir}/` },
  );
  app.useStaticAssets(
    join(process.cwd(), storeDir),
    { prefix: `/${storeDir}/` },
  );

  await app.init();
  const server = app.getHttpServer();

  if (!isPartial) {
    const { userToken: tokenUser, user2Token: tokenUser2, adminToken: tokenAdmin, superAdminToken: tokenSuperAdmin } = await loginAllRoles(server);
    return { app, server, tokenUser, tokenUser2, tokenAdmin, tokenSuperAdmin };
  }
  else 
    return { app, server};
};
