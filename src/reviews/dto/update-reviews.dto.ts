import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  Max,
  Length,
  IsOptional,
} from 'class-validator';

export class UpdateReviewsDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @IsString()
  @IsNotEmpty()
  @Length(2, 150)
  @IsOptional()
  comment?: string;
}
