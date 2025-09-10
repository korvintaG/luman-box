import { INestApplication } from '@nestjs/common';
import { setupTestApp } from 'src/test/tests.helpers';
import { login, expectLoginAndCookies, refreshTokenAfterLogin } from './auth.helpers';
import { StatusCode } from 'src/types/custom';

describe('AuthService (integration)', () => {
  let app: INestApplication;
  let server: any;

  const userLogin = process.env.USER_LOGIN;
  const userPassword = process.env.USER_PASSWORD;
  const errorLogin = process.env.ERROR_LOGIN;
  const errorPassword = process.env.ERROR_PASSWORD;
  const adminLogin = process.env.ADMIN_LOGIN;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const superAdminLogin = process.env.SUPER_ADMIN_LOGIN;
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;


  beforeAll(async () => {
    if (!userLogin || !userPassword || !errorLogin || !errorPassword || !adminLogin || !adminPassword || !superAdminLogin || !superAdminPassword) {
      throw new Error('ENV is missing USER_LOGIN/USER_PASSWORD/ERROR_LOGIN/ERROR_PASSWORD/ADMIN_LOGIN/ADMIN_PASSWORD/SUPER_ADMIN_LOGIN/SUPER_ADMIN_PASSWORD');
    }
    ({ app, server } = await setupTestApp(true));
  });

  afterAll(async () => {
    await app?.close();
  });

  it('Логин пользователя выдает токены и роль пользователя', async () => {
    await expectLoginAndCookies(server, userLogin as string, userPassword as string, 0);
  });

  it('Обновление токена выдает токены и роль пользователя', async () => {
    const res = await refreshTokenAfterLogin(server, userLogin as string, userPassword as string);
    expect(res.body).toHaveProperty('access_token');
    expect(typeof res.body.access_token).toBe('string');
    expect(res.body.access_token.length).toBeGreaterThan(100);
    expect(res.body.access_token.length).toBeLessThan(300);
  });

  it('Логин админа выдает токены и роль админа', async () => {
    await expectLoginAndCookies(server, adminLogin as string, adminPassword as string, 1);
  });

  it('Логин супер админа выдает токены и роль супер админа', async () => {
    await expectLoginAndCookies(server, superAdminLogin as string, superAdminPassword as string, 3);
  });

  it('Неверный логин выдает ошибку', async () => {
    const resEmpty = await login(server, null, null, StatusCode.Unauthorized);
    const res = await login(server, errorLogin as string, errorPassword as string, StatusCode.Unauthorized);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toBe('Unauthorized');
  });


}); 