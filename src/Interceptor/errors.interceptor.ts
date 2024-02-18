import { Message } from '@/decorators/message.decorator';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        const customError = {
          statusCode: err.status,
          message:
            this?.reflector?.get(Message, context.getHandler()) ??
            '',
          data: err.response,
          timestamp: new Date().toISOString(),
        };
        return throwError(() => new HttpException(customError, err.status));
      }),
    );
  }
}
