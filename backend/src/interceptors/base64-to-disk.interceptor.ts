// base64-to-disk.interceptor.ts
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import * as fs from 'fs';
  import * as path from 'path';
  
  @Injectable()
  export class Base64ToDiskInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      console.log('📝 [Base64ToDiskInterceptor]');
      const req: any = context.switchToHttp().getRequest();
  
      if (req.file && req.file.path) {
        const filePath = req.file.path;
        const buf = fs.readFileSync(filePath);
  
        // Проверим, не base64 ли внутри (содержимое ASCII)
        const asText = buf.toString('utf8');
        if (/^[A-Za-z0-9+/=\r\n]+$/.test(asText)) {
          try {
            const decoded = Buffer.from(asText, 'base64');
            fs.writeFileSync(filePath, decoded); // заменяем содержимое на бинарник
            console.log(`📥 Base64 decoded and written to ${filePath}`);
  
            // Чтобы контроллер видел правильный размер
            req.file.size = decoded.length;
          } catch (e) {
            console.warn('⚠️ Base64 decode failed, keeping original file');
          }
        }
      }
  
      return next.handle();
    }
  }
  