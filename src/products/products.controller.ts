import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductsService } from './products.service';
import { AuthRolesGuard } from '../users/guards/auth-roles.guard';
import { UserType } from '../util/enums';
import { Roles } from '../users/decorators/user-role.decorator';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import type { JWTPayloadType } from '../util/types';

// type ProductType = { id: number; title: string; price: number };

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  // POST: ~/api/products
  @Post()
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  public createNewProduct(
    @CurrentUser() payload: JWTPayloadType,
    @Body() body: CreateProductDto,
  ) {
    return this.productsService.create(body, payload.id);
  }
  // GET: ~/api/products
  @Get()
  public getAllProducts(
    @Query('title') title: string,
    @Query('minPrice', ParseIntPipe) minPrice: number,
    @Query('maxPrice', ParseIntPipe) maxPrice: number,
  ) {
    return this.productsService.getAll(title, minPrice, maxPrice);
  }

  // GET: ~/api/products/:id
  @Get(':id')
  public getSingleProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getSingleProduct(id);
  }
  // PUT: ~/api/products/:id
  @Put(':id')
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  public updateSingleProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
  ) {
    return this.productsService.update(id, body);
  }

  // DELETE: ~/api/products/:id
  @Delete(':id')
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  public deleteSingleProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.delete(id);
  }
}
