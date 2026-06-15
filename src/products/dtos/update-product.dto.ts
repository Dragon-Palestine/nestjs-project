import { IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @Length(2, 150)
  title?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;
}
