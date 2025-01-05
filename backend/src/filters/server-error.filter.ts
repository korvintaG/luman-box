import {
    ArgumentsHost,
    Catch,
    HttpStatus,
    ExceptionFilter,
    HttpException,
  } from '@nestjs/common';
  
  @Catch()
  export class ServerErrorExceptionFilter implements ExceptionFilter {
    catch(exception, host: ArgumentsHost) {
        let { message: errMsg, stack: errStack, name: errName, code } = exception;

        let ctx = host.switchToHttp();
        let res = ctx.getResponse();
        if (exception instanceof HttpException) {
            res.status(exception.getStatus()).json(exception.getResponse());
            return;
        }
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        if (code==='23502')
            statusCode =HttpStatus.BAD_REQUEST;
        res.status(statusCode).json({
            message: errMsg
          });

    }
  }
  