import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductRepository } from '@app/ports/outbound/product.repository';
import { Product } from '@domain/entities/product.entity';
import { ProductORM } from '@infrastructure/database/entities/product.orm.entity';

@Injectable()
export class ProductRepositoryImpl implements ProductRepository {
  constructor(
    @InjectRepository(ProductORM)
    private readonly productRepository: Repository<ProductORM>,
  ) {}

  async findAll(): Promise<Product[]> {
    const productsORM = await this.productRepository.find();
    return productsORM.map((productORM) => productORM.toProduct(productORM));
  }

  async findOne(id: string): Promise<Product | null> {
    const productORM = await this.productRepository.findOne({
      where: {
        id,
      },
    });
    return productORM ? productORM.toProduct(productORM) : null;
  }
}
