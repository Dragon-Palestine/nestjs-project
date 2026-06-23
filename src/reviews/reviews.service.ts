import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
import { CreateReviewsDto } from './dto/create-reviews.dto';
import { Repository } from 'typeorm';
import { Review } from './reviews.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateReviewsDto } from './dto/update-reviews.dto';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/user.entity';

@Injectable()
export class ReviewsService {
  public constructor(
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    private readonly config: ConfigService,
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
    const user: User = await this.usersService.CurrentUser(userId);
    const product = await this.productsService.getSingleProduct(productId);
    const review = this.reviewRepo.create({ ...data, user, product });
    return await this.reviewRepo.save(review);
  }
  /**
   *
   * @param userId
   * @param reviewId
   * @param UpdateReviewsDto
   * @returns Promise<Review>
   */
  public async update(
    userId: number,
    reviewId: number,
    data: UpdateReviewsDto,
  ): Promise<Review> {
    const review: Review = await this.getSingle(reviewId);

    if (review.user.id !== userId) {
      throw new BadRequestException('unauthorized !');
    }

    review.rating = data.rating ?? review.rating;
    review.comment = data.comment ?? review.comment;

    return await this.reviewRepo.save(review);
  }

  /**
   *
   * @param userId
   * @param reviewId
   * @returns
   */

  public async delete(userId: number, reviewId: number): Promise<Review> {
    const review: Review = await this.getSingle(reviewId);
    if (review.user.id !== userId)
      throw new BadRequestException('unauthorized !');
    return await this.reviewRepo.remove(review);
  }

  public async getSingle(id: number) {
    const review = await this.reviewRepo.findOne({ where: { id } });
    if (!review) throw new NotFoundException('this id is not in !!');
    return review;
  }
  /**
   *
   * @returns
   */
  public getAll(pageNumber: number): Promise<Review[]> {
    const revPerPage: number = +(this.config.get('REVIEW_PER_PAGE') ?? 3);
    return this.reviewRepo.find({
      skip: pageNumber * (revPerPage - 1),
      take: revPerPage,
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
