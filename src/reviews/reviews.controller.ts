import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { UserType } from 'src/util/enums';
import { AuthRolesGuard } from 'src/users/guards/auth-roles.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import type { JWTPayloadType } from 'src/util/types';
import { CreateReviewsDto } from './dto/create-reviews.dto';
@Controller('api/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post(':productId')
  @Roles(UserType.NORMAL_USER, UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  public createReview(
    @Param('productId', ParseIntPipe) productId: number,
    @CurrentUser() payload: JWTPayloadType,
    @Body() body: CreateReviewsDto,
  ) {
    console.log(payload);
    return this.reviewsService.create(payload.id, productId, body);
  }
  // GET: ~/api/reviews
  @Get()
  public getAllReviews() {
    return this.reviewsService.getAll();
  }
}
