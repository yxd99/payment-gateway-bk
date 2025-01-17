import { Test, TestingModule } from '@nestjs/testing';

import { ProductRepository } from '@app/ports/outbound/product.repository';
import { ProductService } from '@app/services/products.service';
import { Product } from '@domain/entities/product.entity';

const mockProductRepository = {
  findAll: jest.fn(),
  findOne: jest.fn(),
};

describe('ProductService', () => {
  let service: ProductService;
  let repository: ProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: 'ProductRepository', useValue: mockProductRepository },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<ProductRepository>('ProductRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of products', async () => {
      const products: Product[] = [
        new Product('1', 'Product 1', 100, '', 5, new Date(), new Date()),
        new Product('2', 'Product 2', 100, '', 5, new Date(), new Date()),
      ];
      repository.findAll = jest.fn().mockResolvedValue(products);

      const result = await service.getProducts();

      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toEqual(products);
      expect(repository.findAll).toHaveBeenCalled();
      try {
        result.getError();
      } catch (error) {
        expect(error.message).toEqual('No error in a successful result');
      }
    });

    it('should return a failure if an error occurs', async () => {
      repository.findAll = jest
        .fn()
        .mockRejectedValue(new Error('Error fetching products'));

      const result = await service.getProducts();

      expect(result.isSuccess).toBe(false);
      expect(result.getError()).toEqual('Error fetching products');

      try {
        result.getValue();
      } catch (error) {
        expect(error.message).toEqual(
          'Cannot get the value from a failed result',
        );
      }
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

      repository.findOne = jest.fn().mockResolvedValue(product);

      const result = await service.getProductById('1');

      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toEqual(product);
      expect(repository.findOne).toHaveBeenCalledWith('1');

      try {
        result.getError();
      } catch (error) {
        expect(error.message).toEqual('No error in a successful result');
      }
    });

    it('should return a failure if product is not found', async () => {
      repository.findOne = jest.fn().mockResolvedValue(null);

      const result = await service.getProductById('99');

      expect(result.isSuccess).toBe(false);
      expect(result.getError()).toEqual('Product not found');
      try {
        result.getValue();
      } catch (error) {
        expect(error.message).toEqual(
          'Cannot get the value from a failed result',
        );
      }
    });

    it('should return a failure if an error occurs', async () => {
      repository.findOne = jest
        .fn()
        .mockRejectedValue(new Error('Error fetching product by ID'));

      const result = await service.getProductById('99');

      expect(result.getError()).toEqual('Error fetching product by ID');
    });
  });
});
