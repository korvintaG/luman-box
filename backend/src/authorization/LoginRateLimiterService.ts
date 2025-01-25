import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RateLimiterMemory } from 'rate-limiter-flexible';

@Injectable()
export class LoginRateLimiterService {
  private rateLimiter: RateLimiterMemory;

  constructor() {
    this.rateLimiter = new RateLimiterMemory({
      points: 10, // Максимальное количество неудачных попыток
      duration: 60 * 60, // Период (1 час)
      keyPrefix: 'login_fail', // Префикс для идентификации
    });
  }

  async checkLimit(key: string) {
    try {
      await this.rateLimiter.consume(key); // Потребляем 1 попытку
    } catch (rateLimiterRes) {
      const waitTime = Math.ceil(rateLimiterRes.msBeforeNext / 1000 / 60);
      throw new UnauthorizedException(
        `Превышено количество попыток входа. Попробуйте снова через ${waitTime} минут.`,
      );
    }
  }

  async resetLimit(key: string) {
    await this.rateLimiter.delete(key); // Сбрасываем счетчик для успешного логина
  }
}