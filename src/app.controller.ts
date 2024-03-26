import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './decorators/public.decorator';
import { Message } from './decorators/message.decorator';
import { ExcludeInterceptor } from './decorators/exclude-transform-interceptor.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello(); 
  }
}
