import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // Переопределяем метод handleRequest, чтобы избежать выбрасывания исключений
  handleRequest(err: any, user: any, info: any, context: any) {
    // Если пользователя нет, просто возвращаем null, чтобы доступ не блокировался
    if (err || !user) {
      return null;
    }
    return user;
  }
}
