import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductRepository } from '@app/ports/outbound/product.repository';
import { Product } from '@domain/entities/product.entity';
import { ProductORM } from '@infrastructure/database/entities/product.orm.entity';
import { PaginationDto } from '@infrastructure/http/dto/pagination.dto';

@Injectable()
export class ProductRepositoryImpl implements ProductRepository {
  constructor(
    @InjectRepository(ProductORM)
    private readonly productRepository: Repository<ProductORM>,
  ) {}

  async findAll(pagination: PaginationDto): Promise<Product[]> {
    const { page, size } = pagination;
    const productsORM = await this.productRepository.find({
      skip: page - 1,
      take: size,
    });
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
