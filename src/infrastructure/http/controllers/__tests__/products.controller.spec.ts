import { Test, TestingModule } from '@nestjs/testing';

import { Result } from '@app/common/result';
import { ProductService } from '@app/services/products.service';
import { Product } from '@domain/entities/product.entity';
import { ProductController } from '@infrastructure/http/controllers/products.controller';

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
        new Product('1', 'Product 1', 100, new Date(), new Date()),
        new Product('2', 'Product 2', 100, new Date(), new Date()),
      ];
      service.getProducts = jest.fn().mockResolvedValue(Result.ok(products));

      const result = await controller.getAllProducts();

      expect(result).toEqual(products);
      expect(service.getProducts).toHaveBeenCalled();
    });

    it('should throw an error if an error occurs', async () => {
      service.getProducts = jest.fn().mockResolvedValue(Result.fail('Error'));

      await expect(controller.getAllProducts()).rejects.toThrow('Error');
    });
  });

  describe('getProductById', () => {
    it('should return a product by ID', async () => {
      const product = new Product(
        '1',
        'Product 1',
        100,
        new Date(),
        new Date(),
      );

      service.getProductById = jest.fn().mockResolvedValue(Result.ok(product));

      const result = await controller.getProductById('1');

      expect(result).toEqual(product);
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
