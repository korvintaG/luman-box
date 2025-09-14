import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';

export function requestSizeLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  // Проверяем, что request существует и имеет необходимые свойства
  if (!req || !req.headers || typeof req.get !== 'function') {
        return next();
  }
  
  // Пропускаем Telegram webhook запросы
  if (req.path?.includes('/telegram') || 
        req.headers['x-telegram-bot-api-secret-token'] || 
        req.headers['user-agent']?.includes('TelegramBot') 
        //req.headers['content-type']?.includes('application/json')
        ) {
      return next();
  }

  // Пропускаем webhook-запросы от Telegram
  //if (req.path.includes('/telegram') || req.headers['x-telegram-bot-api-secret-token'] || req.headers['user-agent']?.includes('TelegramBot')) {
  //  return next();
  //}
  
  const configService = new ConfigService();
  const maxRequestSize = configService.get<number>('MAX_REQUEST_SIZE_KB', 100) * 1024; // По умолчанию 100KB
  
  // Лимит тела запроса
  const contentLength = parseInt(req.headers['content-length'] || '0');
  if (contentLength > maxRequestSize) {
    return res.status(413).json({
      message: `Request entity too large. Maximum size is ${configService.get('MAX_REQUEST_SIZE_KB', 100)}KB.`
    });
  }
  next();
} 