import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response as ExpressResponse } from 'express';
import { Reflector } from '@nestjs/core';
import { Message } from '@/decorators/message.decorator';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<ExpressResponse>();
    const responseMessage = this?.reflector?.get(Message, context.getHandler()) ?? '';
    return next.handle().pipe(
      map((data) => ({
        data,
        statusCode: response.statusCode,
        author: 'Do Thanh Vung',
        message: responseMessage
      })),
    );
  }
}
