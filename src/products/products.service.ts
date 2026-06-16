import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProductDto } from './dtos/update-product.dto';
import { CreateProductDto } from './dtos/create-product.dto';
import { UsersService } from 'src/users/users.service';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsService {
  constructor(
    private readonly userService: UsersService,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  /**
   *
   * @param data
   * @returns Promise<Product>
   */

  public async create(data: CreateProductDto): Promise<Product> {
    const newProduct: Product = this.productRepo.create(data);
    await this.productRepo.save(newProduct);
    return newProduct;
  }

  /**
   *
   * @returns Promise<Product[]>
   */

  public async getAll(): Promise<Product[]> {
    const products: Product[] = await this.productRepo.find();
    return products;
  }
  /**
   *
   * @param id
   * @returns Promise<Product>
   */
  public async getSingleProduct(id: number): Promise<Product> {
    const product: Product | null = await this.productRepo.findOne({
      where: { id },
    });
    if (!product) throw new NotFoundException('this id is not in !!');
    return product;
  }
  /**
   *
   * @param id
   * @param updateProductDto
   * @returns
   */
  public async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product: Product | null = await this.productRepo.findOne({
      where: { id },
    });
    if (!product) throw new NotFoundException('this id is not in !!');
    product.title = updateProductDto.title ?? product.title;
    product.description = updateProductDto.description ?? product.description;
    product.price = updateProductDto.price ?? product.price;

    return await this.productRepo.save(product);
  }
  /**
   *
   * @param id
   * @returns
   */
  public async delete(id: number): Promise<string> {
    const product: Product | null = await this.productRepo.findOne({
      where: { id },
    });
    if (!product) throw new NotFoundException('this id is not in !!');
    await this.productRepo.remove(product);

    return 'product deleted';
  }
}
