import { Controller, Get } from '@nestjs/common';
@Controller()
export class ReviewsController {
  // GET: ~/api/reviews
  @Get()
  public getAllReviews() {
    return [
      { id: 1, rating: 2, comment: 'bad' },
      { id: 2, rating: 5, comment: 'very good' },
    ];
  }
}
