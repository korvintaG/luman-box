import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { join } from 'path';
import { loginAllRoles } from 'src/authorization/tests/auth.helpers';

export const setupTestApp = async (): Promise<{
  app: NestExpressApplication;
  server: any;
  tokenUser: string;
  tokenAdmin: string;
  tokenSuperAdmin: string;
}> => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { logger: false });
  app.setGlobalPrefix('api');

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

  const { userToken: tokenUser, adminToken: tokenAdmin, superAdminToken: tokenSuperAdmin } = await loginAllRoles(server);

  return { app, server, tokenUser, tokenAdmin, tokenSuperAdmin };
};
