import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/registerDto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/loginDto';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenType, JWTPayloadType } from 'src/util/types';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDto } from './dto/updateUserDto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
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
    const user: User | null = await this.userRepo.findOne({ where: { email } });
    if (user) {
      throw new BadRequestException('this user is already exist !');
    }
    const hashPassword: string = await this.generateHashPassword(password);

    const newUser: User = this.userRepo.create({
      email,
      password: hashPassword,
      userName,
    });
    await this.userRepo.save(newUser);

    const accessToken: AccessTokenType = await this.generateJwt({
      id: newUser.id,
      role: newUser.role,
    });
    return accessToken;
  }

  /**
   * login user and return access token
   * @param LoginDto
   * @returns Promise<AccessTokenType>
   */
  public async login({ email, password }: LoginDto): Promise<AccessTokenType> {
    const user: User | null = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new BadRequestException('this user is not found !');

    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new BadRequestException('password is not correct !');

    const accessToken: AccessTokenType = await this.generateJwt({
      id: user.id,
      role: user.role,
    });

    return accessToken;
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
      password = await this.generateHashPassword(password);
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

  /**
   * generate jwt
   * @param payload -> JWTPayloadType
   * @returns {accessToken} -> Promise<AccessTokenType>
   */
  public async generateJwt(payload: JWTPayloadType): Promise<AccessTokenType> {
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }
  /**
   *
   * @param password
   * @returns hash password
   */
  public async generateHashPassword(password: string): Promise<string> {
    const salt: string = await bcrypt.genSalt(10);
    const hashPassword: string = await bcrypt.hash(password, salt);
    return hashPassword;
  }
}
