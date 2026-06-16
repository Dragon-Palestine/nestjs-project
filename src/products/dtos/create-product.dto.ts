import { IsNotEmpty, IsNumber, IsString, Min, Length } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 150)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 150)
  description!: string;

  @IsNumber()
  @Min(0)
  price!: number;
}
