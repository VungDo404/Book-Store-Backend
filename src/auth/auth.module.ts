import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from '@/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategyAccessToken } from './strategies/jwt.access-token.strategy';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategyAccessToken, GoogleStrategy],
})
export class AuthModule {}
