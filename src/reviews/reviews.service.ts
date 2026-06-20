import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';
import { CreateReviewsDto } from './dto/create-reviews.dto';
import { Repository } from 'typeorm';
import { Review } from './reviews.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ReviewsService {
  public constructor(
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
  ) {}

  /**
   *
   * @param userId
   * @param productId
   * @param data
   * @returns Promis<Reviews>
   */
  public async create(
    userId: number,
    productId: number,
    data: CreateReviewsDto,
  ): Promise<Review> {
    const user = await this.usersService.CurrentUser(userId);
    const product = await this.productsService.getSingleProduct(productId);
    const review = this.reviewRepo.create({ ...data, user, product });
    return await this.reviewRepo.save(review);
  }
  public getAll() {
    return [
      { id: 1, rating: 2, comment: 'bad' },
      { id: 2, rating: 5, comment: 'very good' },
    ];
  }
}
