import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductsService } from './products.service';

// type ProductType = { id: number; title: string; price: number };

@Controller('api/products')
export class ProductsController {
  private productsService: ProductsService = new ProductsService();

  // POST: ~/api/products
  @Post()
  public createNewProduct(@Body() body: CreateProductDto) {
    return this.productsService.create(body);
  }
  // GET: ~/api/products
  @Get()
  public getAllProducts() {
    return this.productsService.getAll();
  }

  // GET: ~/api/products/:id
  @Get(':id')
  public getSingleProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getSingleProduct(id);
  }
  // PUT: ~/api/products/:id
  @Put(':id')
  public updateSingleProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
  ) {
    return this.productsService.update(id, body);
  }

  // DELETE: ~/api/products/:id
  @Delete(':id')
  public deleteSingleProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.delete(id);
  }
}
