import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from '../decorators/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<number | number[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRole) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user || user.role_id == null) {
      return false;
    }
    
    // Если передан массив ролей, проверяем вхождение
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role_id);
    }
    
    // Если передан один номер роли, используем иерархию (>=)
    return user.role_id >= requiredRole;
  }
}
