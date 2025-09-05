import request from 'supertest';

export const loginAndGetAccessToken = async (
  server: any,
  name: string,
  password: string,
  expectedStatus = 201
): Promise<string> => {
  const res = await request(server)
    .post('/api/auth/login')
    .send({ name, password })
    .expect(expectedStatus);
  return res.body.access_token;
};

export const loginAllRoles = async (server: any): Promise<{
  userToken: string;
  adminToken: string;
  superAdminToken: string;
}> => {
  const userToken = await loginAndGetAccessToken(
    server,
    process.env.USER_LOGIN as string,
    process.env.USER_PASSWORD as string
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
  return { userToken, adminToken, superAdminToken };
}; 

