import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/registerDto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/loginDto';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenType, JWTPayloadType } from '../util/types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthProvider {
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
   *
   * @param password
   * @returns hash password
   */
  public async generateHashPassword(password: string): Promise<string> {
    const salt: string = await bcrypt.genSalt(10);
    const hashPassword: string = await bcrypt.hash(password, salt);
    return hashPassword;
  }

  /**
   * generate jwt
   * @param payload -> JWTPayloadType
   * @returns {accessToken} -> Promise<AccessTokenType>
   */
  private async generateJwt(payload: JWTPayloadType): Promise<AccessTokenType> {
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }
}
