import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { updateProductDto } from './dtos/update-product.dto';

type int = number;
type ProductType = { id: int; title: string; price: int };

@Controller('api/products')
export class ProductsController {
  private products: ProductType[] = [
    { id: 1, title: 'book', price: 10 },
    { id: 2, title: 'pen', price: 5 },
    { id: 3, title: 'lap', price: 400 },
  ];

  @Post()
  public createNewProduct(@Body() body: CreateProductDto): CreateProductDto {
    const newProduct: ProductType = {
      id: this.products.length + 1,
      title: body.title,
      price: body.price,
    };
    this.products.push(newProduct);

    return body;
  }
  // GET: ~/api/products
  @Get()
  public getAllProducts() {
    return this.products;
  }

  // GET: ~/api/products
  @Get(':id')
  public getSingleProduct(@Param('id') id: string) {
    const product = this.products.find((p) => p.id === +id);
    if (!product) throw new NotFoundException('this id is not in !!');
    return product;
  }

  // PUT: ~/api/products
  @Put(':id')
  public updateSingleProduct(
    @Param('id') id: string,
    @Body() body: updateProductDto,
  ) {
    const product = this.products.find((p) => p.id === +id);
    if (!product) throw new NotFoundException('this id is not in !!');
    console.log(body);
    return product;
  }

  // DELETE: ~/api/products
  @Delete(':id')
  public deleteSingleProduct(@Param('id') id: string) {
    const product = this.products.find((p) => p.id === +id);
    if (!product) throw new NotFoundException('this id is not in !!');
    return product;
  }
}
