import { SetMetadata } from '@nestjs/common';

export const ROLE_KEY = 'role';
export const WithRole = (role: number | number[]) => 
    SetMetadata(ROLE_KEY, role);
