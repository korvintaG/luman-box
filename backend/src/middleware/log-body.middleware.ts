// src/common/middleware/log-body.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LogBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const chunks: Buffer[] = [];
    let received = 0;

    req.on('data', (chunk: Buffer) => {
      received += chunk.length;
      chunks.push(chunk);
    });

    req.on('end', () => {
      const bodyBuffer = Buffer.concat(chunks);
      const contentLength = req.headers['content-length'];

      let preview = '';
      if (bodyBuffer.length > 0) {
        //const firstBytes = bodyBuffer.subarray(0, 40).toString('hex');
        //const lastBytes = bodyBuffer.subarray(-40).toString('hex');
        preview = `${bodyBuffer.toString('hex')}`;
        console.log('📝 [BodyLogger]');
        console.log(`URL: ${req.method} ${req.originalUrl}`);
        console.log(`Content-Length (header): ${contentLength}`);
        console.log(`Bytes received: ${received}`);
        console.log(`Preview (hex): ${preview}`);
        }

    });

    next();
  }
}
