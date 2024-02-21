import { IS_PUBLIC_KEY } from '@/decorators/public.decorator';
import { User } from '@/users/schemas/user.schema';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAccessTokenAuthGuard extends AuthGuard('jwt-access-token') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest<TUser = Pick<User, '_id' | 'fullName'>>(
    err,
    user: TUser,
    info: Error,
  ){
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid Access Token');
    }
    return user;
  }
}
