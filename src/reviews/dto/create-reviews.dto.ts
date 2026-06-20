import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  Max,
  Length,
} from 'class-validator';

export class CreateReviewsDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsString()
  @IsNotEmpty()
  @Length(2, 150)
  comment!: string;
}
