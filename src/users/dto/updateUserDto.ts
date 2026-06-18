import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email?: string;

  @IsNotEmpty()
  @IsOptional()
  userName?: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 100)
  @IsOptional()
  password?: string;
}
