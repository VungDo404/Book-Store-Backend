import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { TransformInterceptor } from './Interceptor/transform.interceptor';
import { ErrorsInterceptor } from './Interceptor/errors.interceptor';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalInterceptors(new TransformInterceptor(new Reflector()));
  app.useGlobalInterceptors(new ErrorsInterceptor(new Reflector()));
  app.useGlobalPipes(new ValidationPipe({whitelist: true, transform: true}));
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  });
  app.use(cookieParser());
  const configService = app.get(ConfigService);
  await app.listen(configService.get('BACKEND_PORT'));
}
bootstrap();
