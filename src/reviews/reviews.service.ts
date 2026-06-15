import { Injectable } from '@nestjs/common';

@Injectable()
export class ReviewsService {
  public getAll() {
    return [
      { id: 1, rating: 2, comment: 'bad' },
      { id: 2, rating: 5, comment: 'very good' },
    ];
  }
}
