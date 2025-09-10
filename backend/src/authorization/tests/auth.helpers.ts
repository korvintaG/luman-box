import { StatusCode } from 'src/types/custom';
import request from 'supertest';

export const loginAndGetAccessToken = async (
  server: any,
  name: string,
  password: string,
  expectedStatus = StatusCode.successAuth
): Promise<string> => {
  const res = await request(server)
    .post('/api/auth/login')
    .send({ name, password })
    .expect(expectedStatus);
  return res.body.access_token;
};

export const login = async (
  server: any,
  name: string | null,
  password: string | null,
  expectedStatus = StatusCode.successAuth
): Promise<any> => {
  if (!name || !password) {
    const res = await request(server)
    .post('/api/auth/login')
    .send()
    .expect(expectedStatus);
    return res;
  }
  else {  
  const res = await request(server)
    .post('/api/auth/login')
    .send({ name, password })
    .expect(expectedStatus);
    return res;
  }
};


export const loginAllRoles = async (server: any): Promise<{
  userToken: string;
  user2Token: string;
  adminToken: string;
  superAdminToken: string;
}> => {
  const userToken = await loginAndGetAccessToken(
    server,
    process.env.USER_LOGIN as string,
    process.env.USER_PASSWORD as string
  );
  const user2Token = await loginAndGetAccessToken(
    server,
    process.env.USER2_LOGIN as string,
    process.env.USER2_PASSWORD as string
  );
  const adminToken = await loginAndGetAccessToken(
    server,
    process.env.ADMIN_LOGIN as string,
    process.env.ADMIN_PASSWORD as string
  );
  const superAdminToken = await loginAndGetAccessToken(
    server,
    process.env.SUPER_ADMIN_LOGIN as string,
    process.env.SUPER_ADMIN_PASSWORD as string
  );
  return { userToken, user2Token, adminToken, superAdminToken };
}; 

export const expectLoginAndCookies = async (
  server: any,
  name: string,
  password: string,
  expectedRole: number
): Promise<void> => {
  const res = await login(server, name, password);

  expect(res.body).toHaveProperty('access_token');
  expect(typeof res.body.access_token).toBe('string');
  expect(res.body.access_token.length).toBeGreaterThan(100);
  expect(res.body.access_token.length).toBeLessThan(300);

  expect(res.body).toHaveProperty('user');
  expect(res.body.user).toHaveProperty('role_id');
  expect(typeof res.body.user.role_id).toBe('number');
  expect(res.body.user.role_id).toBe(expectedRole);

  const setCookieHeader = res.headers['set-cookie'];
  expect(Array.isArray(setCookieHeader)).toBe(true);
  const refreshCookie = (setCookieHeader as string[]).find((c) => c.startsWith('refreshToken='));
  expect(refreshCookie).toBeDefined();

  const refreshTokenValue = (refreshCookie as string).split(';')[0].split('=')[1];
  expect(typeof refreshTokenValue).toBe('string');
  expect(refreshTokenValue.length).toBeGreaterThan(100);
  expect(refreshTokenValue.length).toBeLessThan(300);

  expect(refreshCookie as string).toMatch(/(Max-Age=\d+|Expires=[^;]+)/);
}; 

export const refreshToken = async (
  server: any,
  //accessToken: string,
  expectedStatus = StatusCode.successAuth
): Promise<any> => {
  const res = await request(server)
    .get('/api/auth/token')
    //.set('Cookie', `refreshToken=${accessToken}`)
    .expect(expectedStatus);
  return res;
};

export const refreshTokenAfterLogin = async (
  server: any,
  name: string,
  password: string,
  expectedStatus = StatusCode.successAuth
): Promise<any> => {
  const agent = request.agent(server);
  await agent
    .post('/api/auth/login')
    .send({ name, password })
    .expect(StatusCode.successAuth);

  const res = await agent
    .get('/api/auth/token')
    .expect(expectedStatus);
  return res;
};