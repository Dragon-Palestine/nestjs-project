import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/registerDto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from './dto/loginDto';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenType, JWTPayloadType } from 'src/util/types';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDto } from './dto/updateUserDto';
import { AuthProvider } from './auth.provider';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly authProvider: AuthProvider,
  ) {}

  /**
   * register new user
   * @param RegisterDto
   * @returns Promise<AccessTokenType>
   */
  public async register({
    email,
    password,
    userName,
  }: RegisterDto): Promise<AccessTokenType> {
    return this.authProvider.register({ email, password, userName });
  }

  /**
   * login user and return access token
   * @param LoginDto
   * @returns Promise<AccessTokenType>
   */
  public async login({ email, password }: LoginDto): Promise<AccessTokenType> {
    return this.authProvider.login({ email, password });
  }

  /**
   * get current user
   * @param token -> string
   * @returns Promise<User>
   */
  public async CurrentUser(id: number): Promise<User> {
    const user: User | null = await this.userRepo.findOne({
      where: { id },
    });
    if (!user) throw new BadRequestException('this user is not found !');
    return user;
  }
  /**
   *
   * @param id
   * @param UpdateUserDto
   * @returns updated user
   */
  public async update(
    id: number,
    { userName, password, email }: UpdateUserDto,
  ): Promise<User> {
    const user: User | null = await this.userRepo.findOne({
      where: { id },
    });
    if (!user) throw new BadRequestException('this user is not found !');

    email = email ?? user.email;
    userName = userName ?? user.userName;

    if (password) {
      password = await this.authProvider.generateHashPassword(password);
    }

    return this.userRepo.save({ ...user, email, userName, password });
  }

  public async delete(id: number, payload: JWTPayloadType): Promise<string> {
    const user: User | null = await this.userRepo.findOne({
      where: { id },
    });
    if (!user) throw new BadRequestException('this user is not found !');
    if (user.id === payload.id || payload.role === 'admin')
      await this.userRepo.remove(user);
    else throw new BadRequestException('unauthorized !');
    return 'user deleted successfully';
  }

  /**
   *
   * @returns all users
   */
  public async getAllUsers(): Promise<User[]> {
    return this.userRepo.find();
  }
}
