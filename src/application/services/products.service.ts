import { Inject, Injectable } from '@nestjs/common';

import { Result } from '@app/common/result';
import { ProductRepository } from '@app/ports/outbound/product.repository';
import { Product } from '@domain/entities/product.entity';
import { PaginationDto } from '@infrastructure/http/dto/pagination.dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async getProducts(pagination: PaginationDto): Promise<Result<Product[]>> {
    try {
      const products = await this.productRepository.findAll(pagination);
      return Result.ok(products);
    } catch {
      return Result.fail('Error fetching products');
    }
  }

  async getProductById(id: string): Promise<Result<Product | null>> {
    try {
      const product = await this.productRepository.findOne(id);
      if (product) {
        return Result.ok(product);
      }
      return Result.fail('Product not found');
    } catch {
      return Result.fail('Error fetching product by ID');
    }
  }
}
