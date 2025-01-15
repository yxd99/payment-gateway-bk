import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { Product } from '@domain/entities/product.entity';

@Entity('products')
export class ProductORM {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'name',
    type: 'text',
  })
  name: string;

  @Column({
    name: 'price',
    type: 'decimal',
  })
  price: number;

  @Column({
    name: 'image_url',
    type: 'text',
  })
  imageUrl: string;

  @Column({
    name: 'stock',
    type: 'integer',
  })
  stock: number;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  toProduct(product: ProductORM): Product {
    return new Product(
      product.id,
      product.name,
      product.price,
      product.createdAt,
      product.updatedAt,
    );
  }

  toDBProduct(product: Product): ProductORM {
    const productORM = new ProductORM();
    productORM.id = product.id;
    productORM.name = product.name;
    productORM.price = product.price;
    productORM.createdAt = product.createdAt;
    productORM.updatedAt = product.updatedAt;
    return productORM;
  }

  toProducts(products: ProductORM[]): Product[] {
    return products.map(this.toProduct);
  }
}
