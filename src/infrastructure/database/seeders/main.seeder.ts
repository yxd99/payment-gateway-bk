import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { ProductORM } from '@infrastructure/database/entities/product.orm.entity';

export default class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const productFactory = factoryManager.get(ProductORM);
    await productFactory.saveMany(50);
  }
}
