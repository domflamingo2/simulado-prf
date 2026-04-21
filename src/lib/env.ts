import { z } from 'zod';

const envSchema = z.object({
  DB_HOST: z.string().optional().default('localhost'),
  DB_PORT: z.coerce.number().optional().default(5432),
  DB_USER: z.string().optional().default('username'),
  DB_PASSWORD: z.string().optional().default('password'),
  DB_NAME: z.string().optional().default('database'),
  API_KEY: z.string().optional(),
  APP_PORT: z.coerce.number().optional().default(3000),
  APP_ENV: z.enum(['development', 'production', 'test']).optional().default('development'),
});

export const env = envSchema.parse(process.env);