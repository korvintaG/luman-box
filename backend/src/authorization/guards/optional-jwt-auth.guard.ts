import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // Переопределяем метод handleRequest, чтобы избежать выбрасывания исключений
/*  handleRequest(err: any, user: any, info: any, context: any) {
    // Если пользователя нет, просто возвращаем null, чтобы доступ не блокировался
    if (err || !user) {
      return null;
    }
    return user;
  }*/

    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
      
      // Если токена нет - пропускаем как неавторизованный
      if (!authHeader) {
        return null;
      }
      
      // Если токен есть, но есть ошибка или пользователь не найден - возвращаем 401
      if (err || !user) {
        throw new UnauthorizedException('Invalid token');
      }
      
      return user;
    }    
/*    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
      
      // Если токена нет - пропускаем как неавторизованный
      if (!authHeader) {
        return true;
      }
      
      // Если токен есть - проверяем его валидность
      try {
        return super.canActivate(context);
      } catch (error) {
        // Токен неверный - возвращаем 401
        throw new UnauthorizedException('Invalid token');
      }
    }*/
   

}
