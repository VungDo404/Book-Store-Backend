import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  login(user: any, response: Response) {
    const payload = {
      email: user.email,
      id: user._id,
      avatar: user.avatar,
      role: user.role,
      fullName: user.fullName,
      phone: user.phone,
    };
    response.cookie(
      'refresh_token',
      this.jwtService.sign(
        { _id: user._id, fullName: user.fullName },
        {
          secret: this.configService.get('REFRESH_TOKEN_SECRET'),
          expiresIn: +ms(this.configService.get('REFRESH_TOKEN_EXPIRATION'))/1000,
        },
      ),
    );
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
        expiresIn: +ms(this.configService.get('ACCESS_TOKEN_EXPIRATION'))/1000,
      }),
      user,
    };
  }
}
