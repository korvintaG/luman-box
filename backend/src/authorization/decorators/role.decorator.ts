import { SetMetadata } from '@nestjs/common';

export const ROLE_KEY = 'role';
export const WithRole = (role: number) => SetMetadata(ROLE_KEY, role);
