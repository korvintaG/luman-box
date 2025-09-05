import { INestApplication, UnauthorizedException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Response } from 'express';
import request from 'supertest';
import { AppModule } from '../app.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';

describe('AuthService (integration)', () => {
  let app: INestApplication;
  let authService: AuthService;

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

    app = await NestFactory.create(AppModule, { logger: false });
    app.setGlobalPrefix('api');
    await app.init();

    authService = app.get(AuthService);
  });

  afterAll(async () => {
    await app?.close();
  });

  it('correct login and password should return a token pair', async () => {
    const user = await authService.validateUser(userLogin as string, userPassword as string);
    expect(user).toBeTruthy();

    const res = { cookie: jest.fn() } as unknown as Response;
    const result = await authService.login(res, user as any);

    expect(result).toHaveProperty('access_token');
    expect(typeof result.access_token).toBe('string');
    expect(result).toHaveProperty('success', true);
    expect(result).toHaveProperty('user');
    expect(typeof result.user).toBe('object');
    expect(result.user).toHaveProperty('role_id');
    expect(result.user.role_id).toBeDefined();
    expect(result.user.role_id).toBe(0);
    expect(res.cookie).toHaveBeenCalledWith(
      'refreshToken',
      expect.any(String),
      expect.any(Object)
    );

    expect(typeof result.access_token).toBe('string');
    expect(result.access_token.length).toBeGreaterThan(100);
    expect(result.access_token.length).toBeLessThan(300);

    const cookieCalls = (res.cookie as unknown as jest.Mock).mock.calls;
    const refreshCall = cookieCalls.find((args: any[]) => args[0] === 'refreshToken');
    const refreshToken = refreshCall?.[1] as string;
    expect(typeof refreshToken).toBe('string');
    expect(refreshToken.length).toBeGreaterThan(100);
    expect(refreshToken.length).toBeLessThan(300);
  });

  it('incorrect login should return an error', async () => {
    if (!errorLogin || !errorPassword) {
      throw new Error('ENV is missing ERROR_LOGIN/ERROR_PASSWORD');
    }

    const localStrategy = app.get(LocalStrategy);
    await expect(
      localStrategy.validate(errorLogin as string, errorPassword as string),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('correct admin login and password should return admin role', async () => {
    const user = await authService.validateUser(adminLogin as string, adminPassword as string);
    expect(user).toBeTruthy();
    expect(typeof user).toBe('object');
    expect((user as any)).toHaveProperty('role_id');
    expect((user as any).role_id).toBeDefined();
    expect((user as any).role_id).toBe(1);
  });

  it('correct super admin login and password should return super admin role', async () => {
    const user = await authService.validateUser(superAdminLogin as string, superAdminPassword as string);
    expect(user).toBeTruthy();
    expect(typeof user).toBe('object');
    expect((user as any)).toHaveProperty('role_id');
    expect((user as any).role_id).toBeDefined();
    expect((user as any).role_id).toBe(3);
  });




}); 