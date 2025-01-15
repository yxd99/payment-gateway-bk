import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';

import { ProductORM } from '@infrastructure/database/entities/product.orm.entity';

import MainSeeder from './main.seeder';
import { ProductsFactory } from './products.factory';

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_SCHEMA } =
  process.env;

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: DB_HOST,
  port: Number(DB_PORT) || 5432,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [ProductORM],
  factories: [ProductsFactory],
  schema: DB_SCHEMA,
  seeds: [MainSeeder],
};

const dataSource = new DataSource(options);

dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);
  await runSeeders(dataSource);
  process.exit();
});
