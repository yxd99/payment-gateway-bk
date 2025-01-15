import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { envs } from 'src/infrastructure/config/envs';

export function typeormConfig(): TypeOrmModuleOptions {
  const environment = envs.NODE_ENV;
  const isProd = environment === 'production';
  const extra: Record<string, unknown> = {};

  if (isProd) {
    extra.ssl = {
      rejectUnauthorized: false,
    };
  }

  const config: TypeOrmModuleOptions = {
    username: envs.DB_USER,
    password: envs.DB_PASSWORD,
    host: envs.DB_HOST,
    port: envs.DB_PORT,
    database: envs.DB_NAME,
    schema: envs.DB_SCHEMA,
    type: 'postgres',
    ssl: isProd,
    extra,
    synchronize: environment !== 'production',
    entities: [`${__dirname}/**/*.orm.entity{.ts,.js}`],
    autoLoadEntities: true,
    logging: !isProd,
  };

  return config;
}
