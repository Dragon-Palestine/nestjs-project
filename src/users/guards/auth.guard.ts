import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { CURRENT_USER_KEY } from 'src/util/constants';
import { JWTPayloadType } from 'src/util/types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    try {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];

      if (!token || type !== 'Bearer') {
        throw new UnauthorizedException('Invalid token');
      }

      const secret = this.configService.get<string>('JWT_SECRET');
      if (!secret) {
        throw new UnauthorizedException(
          'Authentication service misconfigured.',
        );
      }
      const payload: JWTPayloadType = await this.jwtService.verifyAsync(token, {
        secret,
      });

      request[CURRENT_USER_KEY] = payload;

      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
