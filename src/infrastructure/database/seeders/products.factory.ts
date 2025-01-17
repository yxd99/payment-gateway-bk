import { faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';

import { ProductORM } from '@infrastructure/database/entities/product.orm.entity';

export const ProductsFactory = setSeederFactory(ProductORM, () => {
  const product = new ProductORM();
  product.name = faker.commerce.productName();
  product.price = Number(
    faker.commerce.price({
      min: 5000,
      max: 50000,
      dec: 0,
    }),
  );
  product.stock = Number(
    faker.helpers.rangeToNumber({
      min: 10,
      max: 30,
    }),
  );
  product.imageUrl =
    'https://placeholder.pics/svg/600x900/000000/B3B3B3-000000/image-url';
  return product;
});
