import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/registerDto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/loginDto';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenType, JWTPayloadType } from 'src/util/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   *
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
    const salt: string = await bcrypt.genSalt(10);
    const hashPassword: string = await bcrypt.hash(password, salt);

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
   *
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
   * @param payload -> JWTPayloadType
   * @returns {accessToken} -> Promise<AccessTokenType>
   */
  public async generateJwt(payload: JWTPayloadType): Promise<AccessTokenType> {
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }
}
