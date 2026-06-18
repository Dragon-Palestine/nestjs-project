import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

import { CURRENT_USER_KEY } from 'src/util/constants';
import { JWTPayloadType } from 'src/util/types';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../users.service';
import { UserType } from 'src/util/enums';
import { User } from '../user.entity';

@Injectable()
export class AuthRolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    try {
      const roles: UserType[] = this.reflector.get(
        'roles',
        context.getHandler(),
      );
      if (!roles || roles.length === 0) return false;

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

      const user: User | null = await this.usersService.CurrentUser(payload.id);
      if (!user) throw new BadRequestException('this user is not found !');

      if (roles.includes(user.role)) return true;

      request[CURRENT_USER_KEY] = payload;
    } catch {
      throw new UnauthorizedException('you are not allowed');
    }

    return false;
  }
}
