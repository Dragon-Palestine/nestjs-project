import { Controller, Get } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
@Controller('api/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}
  // GET: ~/api/reviews
  @Get()
  public getAllReviews() {
    return this.reviewsService.getAll();
  }
}
