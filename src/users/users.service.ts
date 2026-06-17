import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/registerDto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  /**
   *
   * @param RegisterDto
   * @returns Promise<User>
   */
  public async Register({ email, password, userName }: RegisterDto) {
    const user: User | null = await this.userRepo.findOne({ where: { email } });
    if (user) {
      throw new BadRequestException('this user is in !');
    }
    const salt: string = await bcrypt.genSalt(10);
    const hashPassword: string = await bcrypt.hash(password, salt);

    const newUser: User = this.userRepo.create({
      email,
      password: hashPassword,
      userName,
    });
    return await this.userRepo.save(newUser);
  }
  public getAll() {
    return [
      { id: 1, email: 'l.@gmail.ocm' },
      { id: 2, email: 'b@gmail.com' },
    ];
  }
}
