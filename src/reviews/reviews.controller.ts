import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Roles } from '../users/decorators/user-role.decorator';
import { UserType } from '../util/enums';
import { AuthRolesGuard } from '../users/guards/auth-roles.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import type { JWTPayloadType } from '../util/types';
import { CreateReviewsDto } from './dto/create-reviews.dto';
import { UpdateReviewsDto } from './dto/update-reviews.dto';
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
    return this.reviewsService.create(payload.id, productId, body);
  }

  @Put(':reviewId')
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  public updateReview(
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Body() body: UpdateReviewsDto,
    @CurrentUser() payload: JWTPayloadType,
  ) {
    return this.reviewsService.update(payload.id, reviewId, body);
  }

  @Delete(':reviewId')
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  public deleteReview(
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @CurrentUser() payload: JWTPayloadType,
  ) {
    return this.reviewsService.delete(payload.id, reviewId);
  }
  // GET: ~/api/reviews
  @Get()
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  public getAllReviews(@Query('pageNumber', ParseIntPipe) pageNumber: number) {
    return this.reviewsService.getAll(pageNumber);
  }
}
