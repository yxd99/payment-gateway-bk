import { Product } from '@domain/entities/product.entity';
import { PaginationDto } from '@infrastructure/http/dto/pagination.dto';

export interface ProductRepository {
  findAll(pagination: PaginationDto): Promise<Product[]>;
  findOne(id: string): Promise<Product | null>;
}
