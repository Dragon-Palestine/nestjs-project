import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProductDto } from './dtos/update-product.dto';
import { CreateProductDto } from './dtos/create-product.dto';
import { UsersService } from 'src/users/users.service';

type ProductType = { id: number; title: string; price: number };

@Injectable()
export class ProductsService {
  constructor(private readonly userService: UsersService) {}

  private products: ProductType[] = [
    { id: 1, title: 'book', price: 10 },
    { id: 2, title: 'pen', price: 5 },
    { id: 3, title: 'lap', price: 400 },
  ];

  /**
   *
   * @param createProductDto
   * @returns
   */

  public create(createProductDto: CreateProductDto): ProductType {
    const newProduct: ProductType = {
      id: this.products.length + 1,
      title: createProductDto.title,
      price: createProductDto.price,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  /**
   *
   * @returns
   */

  public getAll() {
    return { products: this.products, users: this.userService.getAll() };
  }
  /**
   *
   * @param id
   * @returns ProductType
   */
  public getSingleProduct(id: number): ProductType {
    const product: ProductType | undefined = this.products.find(
      (p) => p.id === id,
    );
    if (!product) throw new NotFoundException('this id is not in !!');
    return product;
  }
  /**
   *
   * @param id
   * @param updateProductDto
   * @returns
   */
  public update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): UpdateProductDto {
    const product = this.products.find((p) => p.id === id);
    if (!product) throw new NotFoundException('this id is not in !!');
    console.log(updateProductDto);
    return updateProductDto;
  }
  /**
   *
   * @param id
   * @returns
   */
  public delete(id: number): string {
    const product = this.products.find((p) => p.id === id);
    if (!product) throw new NotFoundException('this id is not in !!');
    return 'product deleted';
  }
}
