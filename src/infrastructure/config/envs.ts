import 'dotenv/config';
import * as joi from 'joi';

const envSchema = joi
  .object({
    NODE_ENV: joi
      .string()
      .valid('development', 'production', 'test')
      .default('development'),
    PORT: joi.number().default(3000),
    DB_HOST: joi.string().default('localhost'),
    DB_PORT: joi.number().default(5432).required(),
    DB_USER: joi.string().required(),
    DB_NAME: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_SCHEMA: joi.string().default('public'),
  })
  .unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const envs = {
  NODE_ENV: value.NODE_ENV,
  PORT: value.PORT,
  DB_HOST: value.DB_HOST,
  DB_PORT: value.DB_PORT,
  DB_USER: value.DB_USER,
  DB_NAME: value.DB_NAME,
  DB_PASSWORD: value.DB_PASSWORD,
  DB_SCHEMA: value.DB_SCHEMA,
};
