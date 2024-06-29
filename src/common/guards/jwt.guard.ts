import type { ExecutionContext } from '@nestjs/common';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

import { IS_PUBLIC_KEY_META } from '@common/constant';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY_META, context.getHandler());

    if (isPublic) return true;

    return super.canActivate(context);
  }

  handleRequest<User>(error: any, user: User, info: { message: string }) {
    if (error || info || !user) {
      if (info instanceof TokenExpiredError) {
        throw new ForbiddenException();
      } else if (info instanceof JsonWebTokenError) {
        throw new UnauthorizedException();
      } else {
        throw new UnauthorizedException(info?.message);
      }
    }

    return user;
  }
}
