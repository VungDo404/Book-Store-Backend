import { Reflector } from '@nestjs/core';

export const ExcludeInterceptor = Reflector.createDecorator<boolean>();