import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('dev', 'prod').default('dev'),
  PORT: Joi.number().integer().port().default(3000),
  DB_HOST: Joi.string()
    .pattern(/[a-zA-Z]/)
    .required(),
  DB_PORT: Joi.number().integer().port().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_SCHEMA: Joi.string().required(),
});
