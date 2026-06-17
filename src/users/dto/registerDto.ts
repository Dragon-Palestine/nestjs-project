import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 100)
  password!: string;

  @IsOptional()
  @IsString()
  @Length(3, 30)
  userName?: string;
}
