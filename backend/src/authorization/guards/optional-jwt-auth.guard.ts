import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
      
      // Если токена нет - пропускаем как неавторизованный
      if (!authHeader) {
        return null;
      }
      
      // Если токен есть, но есть ошибка или пользователь не найден - возвращаем 401
      if (err || !user) {
        throw new UnauthorizedException({
          error: 'Unauthorized',
          message: 'Invalid token',
        });
      }
      
      return user;
    }    
   

}
