import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { Result } from '@app/common/result';
import { ProductService } from '@app/services/products.service';
import { Product } from '@domain/entities/product.entity';
import { ProductController } from '@infrastructure/http/controllers/products.controller';
import { PaginationDto } from '@infrastructure/http/dto/pagination.dto';

const mockProductService = {
  getProducts: jest.fn(),
  getProductById: jest.fn(),
};

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [{ provide: ProductService, useValue: mockProductService }],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProducts', () => {
    it('should return a list of products', async () => {
      const products: Product[] = [
        new Product('1', 'Product 1', 100, '', 5, new Date(), new Date()),
        new Product('2', 'Product 2', 100, '', 0, new Date(), new Date()),
      ];
      service.getProducts = jest.fn().mockResolvedValue(Result.ok(products));

      const result = await controller.getAllProducts({ page: 1, size: 15 });

      expect(result.getValue()).toEqual(products);
      expect(service.getProducts).toHaveBeenCalled();
    });

    it('should throw an error if an error occurs', async () => {
      service.getProducts = jest.fn().mockResolvedValue(Result.fail('Error'));

      await expect(
        controller.getAllProducts({ page: 1, size: 15 }),
      ).rejects.toThrow('Error');
    });
  });

  describe('getProductById', () => {
    it('should return a product by ID', async () => {
      const product = new Product(
        '1',
        'Product 1',
        100,
        '',
        5,
        new Date(),
        new Date(),
      );

      service.getProductById = jest.fn().mockResolvedValue(Result.ok(product));

      const result = await controller.getProductById('1');

      expect(result.getValue()).toEqual(product);
      expect(service.getProductById).toHaveBeenCalledWith('1');
    });

    it('should throw an error if product is not found', async () => {
      service.getProductById = jest
        .fn()
        .mockResolvedValue(Result.fail('Product not found'));

      await expect(controller.getProductById('99')).rejects.toThrow(
        'Product not found',
      );
    });
  });
});

describe('PaginationDto', () => {
  it('should pass validation with default values', async () => {
    const dto = new PaginationDto();
    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
    expect(dto.page).toBe(1);
    expect(dto.size).toBe(15);
  });

  it('should transform string query params to numbers', async () => {
    const plainObject = { page: '2', size: '20' };
    const dto = plainToClass(PaginationDto, plainObject);

    expect(dto.page).toBe(2);
    expect(dto.size).toBe(20);
  });

  it('should fail validation if page is less than 1', async () => {
    const dto = new PaginationDto();
    dto.page = 0;

    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should fail validation if size is less than 1', async () => {
    const dto = new PaginationDto();
    dto.size = 0;

    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should allow optional parameters', async () => {
    const plainObject = {};
    const dto = plainToClass(PaginationDto, plainObject);

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
    expect(dto.page).toBe(1);
    expect(dto.size).toBe(15);
  });
});
