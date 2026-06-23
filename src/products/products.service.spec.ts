import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { jest, describe, beforeEach, it, expect } from '@jest/globals';

import { ProductsService } from './products.service';
import { UsersService } from '../users/users.service';
import { Product } from './product.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import { Repository } from 'typeorm';

describe('ProductService', () => {
  let productsService: ProductsService;
  let productsRepository: Repository<Product>;
  const REPOSITORY_TOKEN = getRepositoryToken(Product);

  const createProductDto: CreateProductDto = {
    title: 'book',
    price: 100,
    description: 'description',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: UsersService,
          useValue: {
            CurrentUser: jest.fn((userId: number) =>
              Promise.resolve({ id: userId }),
            ),
          },
        },
        {
          provide: REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn((dto: CreateProductDto) => dto),
            save: jest.fn((dto: CreateProductDto) =>
              Promise.resolve({ ...dto, id: 1 }),
            ),
          },
        },
      ],
    }).compile();
    productsRepository = module.get<Repository<Product>>(REPOSITORY_TOKEN);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should product service be defined', () => {
    expect(productsService).toBeDefined();
  });

  it('should product repository be defined', () => {
    expect(productsRepository).toBeDefined();
  });

  it("should call 'create' method in product repository", async () => {
    await productsService.create(createProductDto, 1);

    expect(productsRepository.create).toHaveBeenCalled();
    expect(productsRepository.create).toHaveBeenCalledTimes(1);
  });

  it("should call 'save' method in product repository", async () => {
    await productsService.create(createProductDto, 1);

    expect(productsRepository.save).toHaveBeenCalled();
    expect(productsRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should create a new product', async () => {
    const result = await productsService.create(createProductDto, 1);
    expect(result).toBeDefined();
    expect(result.title).toBe('book');
    expect(result.user.id).toBe(1);
  });
});
