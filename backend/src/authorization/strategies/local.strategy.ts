import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoginRateLimiterService } from '../LoginRateLimiterService';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private loginRateLimiterService: LoginRateLimiterService,
  ) {
    super({
      usernameField: 'name',
    });
  }

  async validate(name: string, password: string) {
    // Ключ для отслеживания попыток (например, по IP или логину)
    const key = name; // Можно заменить на req.ip или IP + username

    // Проверяем лимит только для неудачных попыток
    await this.loginRateLimiterService.checkLimit(key);

    const user = await this.authService.validateUser(name, password);
    if (!user) {
      throw new UnauthorizedException('Не найдено');
    }

    // Если логин успешный, сбрасываем лимит
    await this.loginRateLimiterService.resetLimit(key);

    return user;
  }
}
