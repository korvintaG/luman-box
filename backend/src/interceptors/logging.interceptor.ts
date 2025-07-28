import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

// Класс для управления логами с ротацией
class LogManager {
  private readonly logDir: string;
  private readonly logFile: string;
  private readonly logger: Logger;
  private lastCheckDate: string = '';

  constructor() {
    this.logDir = path.join(__dirname, '..', '..', 'logs');
    this.logFile = path.join(this.logDir, 'requests.log');
    this.logger = new Logger('LogManager');
    this.ensureLogDirectory();
  }

  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private getCurrentDateString(): string {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear().toString().slice(-2);
    return `${day}.${month}.${year}`;
  }

  private shouldRotateLog(): boolean {
    if (!fs.existsSync(this.logFile)) {
      return false;
    }

    const stats = fs.statSync(this.logFile);
    const fileDate = stats.birthtime.toDateString();
    const currentDate = new Date().toDateString();
    
    return fileDate !== currentDate;
  }

  private rotateLog(): void {
    if (!fs.existsSync(this.logFile)) {
      return;
    }

    const dateString = this.getCurrentDateString();
    const rotatedFileName = `requests.${dateString}.log`;
    const rotatedFilePath = path.join(this.logDir, rotatedFileName);

    try {
      fs.renameSync(this.logFile, rotatedFilePath);
      this.logger.log(`Log file rotated: ${rotatedFileName}`);
    } catch (error) {
      this.logger.error(`Failed to rotate log file: ${error.message}`);
    }
  }

  private cleanupOldLogs(): void {
    try {
      const files = fs.readdirSync(this.logDir);
      const logFiles = files.filter(file => 
        file.startsWith('requests') && file.endsWith('.log') && file !== 'requests.log'
      );

      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

      for (const file of logFiles) {
        const filePath = path.join(this.logDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime < tenDaysAgo) {
          fs.unlinkSync(filePath);
          this.logger.log(`Deleted old log file: ${file}`);
        }
      }
    } catch (error) {
      this.logger.error(`Failed to cleanup old logs: ${error.message}`);
    }
  }

  private checkAndRotate(): void {
    const currentDate = this.getCurrentDateString();
    
    // Проверяем ротацию только раз в день
    if (this.lastCheckDate !== currentDate) {
      this.lastCheckDate = currentDate;
      
      if (this.shouldRotateLog()) {
        this.rotateLog();
      }
      
      this.cleanupOldLogs();
    }
  }

  writeLog(logEntry: string): void {
    this.checkAndRotate();
    
    // Получаем московское время
    const moscowTime = new Date().toLocaleString('ru-RU', {
      timeZone: 'Europe/Moscow',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    const logLine = `[${moscowTime}] ${logEntry}\n`;
    
    try {
      fs.appendFileSync(this.logFile, logLine);
    } catch (error) {
      this.logger.error(`Failed to write to log file: ${error.message}`);
    }
  }
}

// Создаем единственный экземпляр LogManager
const logManager = new LogManager();

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const start = Date.now();
    
    const { method, originalUrl, ip } = request;
    const userAgent = request.get('User-Agent') || '';
    
    // Логируем входящий запрос в консоль
    this.logger.log(`${method} ${originalUrl} - ${ip} - ${userAgent}`);
    
    // Подготавливаем данные для записи в файл
    let requestBody = '';
    let responseBody = '';
    
    // Перехватываем тело запроса для POST/PUT/PATCH
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      const originalSend = response.send;
      response.send = function(body) {
        responseBody = typeof body === 'string' ? body : JSON.stringify(body);
        return originalSend.call(this, body);
      };
      
      // Собираем тело запроса
      let data = '';
      request.on('data', chunk => {
        data += chunk;
      });
      request.on('end', () => {
        requestBody = data;
      });
    }
    
    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        const { statusCode } = response;
        
        // Логируем завершенный запрос в консоль
        this.logger.log(`${method} ${originalUrl} ${statusCode} - ${duration}ms`);
        
        // Записываем детальную информацию в файл через LogManager
        const logEntry = {
          timestamp: new Date().toLocaleString('ru-RU', {
            timeZone: 'Europe/Moscow',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          }),
          method,
          url: originalUrl,
          ip,
          userAgent,
          statusCode,
          duration: `${duration}ms`,
          requestBody: requestBody || 'N/A',
          responseBody: responseBody || 'N/A',
          headers: request.headers
        };
        
        logManager.writeLog(JSON.stringify(logEntry, null, 2));
      })
    );
  }
} 