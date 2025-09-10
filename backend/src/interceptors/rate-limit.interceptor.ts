import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  private rateLimiter: RateLimiterMemory;

  constructor(private configService: ConfigService) {
    this.rateLimiter = new RateLimiterMemory({
      points: this.configService.get<number>('RATE_LIMIT_POINTS', 200), // Количество запросов
      duration: this.configService.get<number>('RATE_LIMIT_DURATION_SEC', 60), // За 60 секунд (1 минута)
      blockDuration: this.configService.get<number>('RATE_LIMIT_BLOCK_DURATION_SEC', 60), // Блокировка на 60 секунд при превышении
    });
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    
    // Проверяем, что request существует и имеет необходимые свойства
    if (!request || !request.headers || typeof request.get !== 'function') {
      return next.handle();
    }
    
    // Пропускаем Telegram webhook запросы и JSON запросы
    if (request.path?.includes('/telegram') || 
        request.headers['x-telegram-bot-api-secret-token'] || 
        request.headers['user-agent']?.includes('TelegramBot') ||
        request.headers['content-type']?.includes('application/json')) {
      return next.handle();
    }
    
    try {
      await this.rateLimiter.consume(request.ip || request.socket.remoteAddress || 'unknown');
      return next.handle();
    } catch (rateLimiterRes) {
      const waitTime = Math.ceil(rateLimiterRes.msBeforeNext / 1000);
      throw new HttpException(
        {
          error: 'TooManyRequests',
          message: `Too many requests. Please try again in ${waitTime} seconds.`,
          retryAfter: waitTime,
        },
        HttpStatus.TOO_MANY_REQUESTS
      );
    }
  }
} 