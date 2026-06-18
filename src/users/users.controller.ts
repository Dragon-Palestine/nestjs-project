import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/registerDto';
import { LoginDto } from './dto/loginDto';
import type { AccessTokenType, JWTPayloadType } from 'src/util/types';
import { User } from './user.entity';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Request } from 'express';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  // POST: ~/api/users/auth/register
  @Post('auth/register')
  public registerUser(@Body() body: RegisterDto): Promise<AccessTokenType> {
    return this.usersService.register(body);
  }

  // POST: ~/api/users/auth/login
  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  public loginUser(@Body() body: LoginDto): Promise<AccessTokenType> {
    return this.usersService.login(body);
  }

  // GET: ~/api/users/current-user
  @Get('current-user')
  @UseGuards(AuthGuard)
  public getCurrentUser(@CurrentUser() payload: JWTPayloadType): Promise<User> {
    return this.usersService.CurrentUser(payload.id);
  }
}
