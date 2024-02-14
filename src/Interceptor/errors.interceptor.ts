import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  BadGatewayException,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        const customError = {
            statusCode: err.status ,
            message: err.message || 'An error occurred',
            data: err.response,
            timestamp: new Date().toISOString(),
          };
        return throwError(() => new HttpException(customError, err.status));
      }),
    );
  }
}
