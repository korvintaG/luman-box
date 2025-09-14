import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs/promises';
import path from 'path';
import { formatDateForFilename, getFileCreateDate } from 'src/utils/utils';

@Injectable()
export class LogMiddleware implements NestMiddleware {
    private readonly logDir: string;
    private readonly logFile: string;
    private writeQueue: Promise<void> = Promise.resolve();
  
    constructor() {
      this.logDir = path.join(__dirname, '..', '..', 'logs');
      this.logFile = path.join(this.logDir, 'requests.log');
      //this.logger = new Logger('LogManager');
      this.ensureLogDirectory();
    }

    private async ensureLogDirectory(): Promise<void> {
        try {
            await fs.access(this.logDir);
            // Каталог существует
          } catch (error) {
            // Каталог не существует, создаем его
            await fs.mkdir(this.logDir, { recursive: true });
          }
    }
    
  
    use(req: Request, res: Response, next: NextFunction) {
        let requestBody = '';
        let responseBody = '';
        const originalSend = res.send.bind(res);
        const start = Date.now();
        const { method, originalUrl, ip } = req;
        if (method === 'OPTIONS') {
            next();
            return;
        }
        const userAgent = req.get('User-Agent') || '';
        
        // Логируем входящий запрос
        // this.writeLogAsync(`-> ${method} ${originalUrl} - ${ip} - ${userAgent}`);

        // Логируем cookies запроса
        const cookiesReq = req.headers['cookie'];
        /*if (cookies) {
            this.writeLogAsync(`->o ${method} ${originalUrl} - ${ip} - ${userAgent} - ${cookies}`);
        }*/

        req.on('data', (chunk) => {
            requestBody += chunk.toString();
        });

        req.on('end', () => {
            // Тело запроса собрано
            //if (requestBody) {
            this.writeLogAsync(`-> ${method} ${originalUrl} - ${ip} - ${userAgent} - ${cookiesReq} - ${requestBody}`);
            //}
        });          
        
        res.send = function(body) {
            responseBody = typeof body === 'string' ? body : JSON.stringify(body);
            return originalSend(body);
          };
        

        // Используем событие 'finish' - это безопаснее
        res.on('finish', () => {
          const duration = Date.now() - start;
          const { statusCode } = res;
          const cookiesRes = res.get('Set-Cookie');

          // Логируем завершенный запрос
          this.writeLogAsync(`<- ${method} ${originalUrl} ${statusCode} - ${duration}ms - ${cookiesRes} - ${responseBody}`);
        });
        
        next();
    }

  private async writeLogAsync(note: string) {
    this.writeQueue = this.writeQueue.then(async () => {
        try {
          const logLine = `[${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}] ${note}\n`;
          const fileDate = await getFileCreateDate(this.logFile)
          const currentDate = new Date().toDateString();
          //console.log('fileDate', fileDate, 'currentDate', currentDate);
          if (fileDate && fileDate !== currentDate) {
            await fs.rename(this.logFile, path.join(this.logDir, `requests_${formatDateForFilename(new Date(fileDate))}.log`));
          }
          await fs.appendFile(this.logFile, logLine);
        } catch (error) {
          console.error('Failed to write log:', error);
        }
      });

    
  }

}