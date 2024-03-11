import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { LocalStrategyPayload } from '@/interfaces/auth.interface';
import { AccountDto } from '../dto/account.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<AccountDto> {
    const user: LocalStrategyPayload = await this.usersService.validateUser(
      email,
      password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      _id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
    };
  }
}
