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
import { ExcludeInterceptor } from '@/decorators/exclude-transform-interceptor.decorator';

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
    const responseMessage =
      this?.reflector?.get(Message, context.getHandler()) ?? '';
    const isApplyInterceptor = this?.reflector?.get(ExcludeInterceptor, context.getHandler()) ?? true;
    if(!isApplyInterceptor){
      return next.handle(); 
    }
    return next.handle().pipe(
      map((data) => ({
        statusCode: response.statusCode,
        message: responseMessage,
        data,
        author: 'Do Thanh Vung',
      })),
    );
  }
}
