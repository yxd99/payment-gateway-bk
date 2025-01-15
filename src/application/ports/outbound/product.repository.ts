import { Product } from '@domain/entities/product.entity';

export interface ProductRepository {
  findAll(): Promise<Product[]>;
  findOne(id: string): Promise<Product | null>;
}
