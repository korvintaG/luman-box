import { IUser } from '../custom';
import { Request } from 'express';

// to make the file a module and avoid the TypeScript error
export {};

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

declare module 'express' {
  interface Request {
    fileValidationError?: string;
  }
}
