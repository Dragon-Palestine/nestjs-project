import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/registerDto';
import { LoginDto } from './dto/loginDto';
import type { AccessTokenType } from 'src/util/types';
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
}
