import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/registerDto';
import { User } from './user.entity';
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  // GET: ~/api/reviews
  @Get()
  public getAllUsers() {
    return this.usersService.getAll();
  }

  // POST: ~/api/users/auth/register
  @Post('auth/register')
  public RegisterUser(@Body() body: RegisterDto): Promise<User> {
    return this.usersService.Register(body);
  }
}
