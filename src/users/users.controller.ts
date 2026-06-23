import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Put,
  Delete,
  Headers,
  UseGuards,
  Param,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/registerDto';
import { LoginDto } from './dto/loginDto';
import type { AccessTokenType, JWTPayloadType } from '../util/types';
import { User } from './user.entity';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { Request, Response } from 'express';
import { UserType } from '../util/enums';
import { AuthRolesGuard } from './guards/auth-roles.guard';
import { Roles } from './decorators/user-role.decorator';
import { UpdateUserDto } from './dto/updateUserDto';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Put()
  @UseGuards(AuthGuard)
  public updateCurrentUser(
    @CurrentUser() payload: JWTPayloadType,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(payload.id, body);
  }

  @Delete('id')
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  @UseGuards(AuthRolesGuard)
  public deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() payload: JWTPayloadType,
  ) {
    return this.usersService.delete(id, payload);
  }

  // GET: ~/api/users
  @Get()
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  public getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Post('upload-profile-image')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  public uploadProfileImge(
    @CurrentUser() payload: JWTPayloadType,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.setProfileImage(payload.id, file.filename);
  }

  @Get('profile-image')
  @UseGuards(AuthGuard)
  public showProfileImage(
    @CurrentUser() payload: JWTPayloadType,
    @Res() res: Response,
  ) {
    return this.usersService.getProfileImage(payload.id, res);
  }
}
