import { Message } from '@/decorators/message.decorator';
import { Controller, Post, Request, Response, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response as ExpressResponse } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(AuthGuard('local'))
  @Message('Log in')
  @Post('login')
  async login(
    @Request() req,
    @Response({ passthrough: true }) response: ExpressResponse,
  ) {
    return this.authService.login(req.user, response);
  }
}
