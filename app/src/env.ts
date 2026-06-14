import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(8, 'JWT_SECRET is required'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().min(8).optional(),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  STORAGE_REGION: z.string().default('us-east-1'),
  STORAGE_BUCKET: z.string().min(1, 'STORAGE_BUCKET is required'),
  STORAGE_ACCESS_KEY: z.string().min(1, 'STORAGE_ACCESS_KEY is required'),
  STORAGE_SECRET_KEY: z.string().min(1, 'STORAGE_SECRET_KEY is required'),
  STORAGE_ENDPOINT: z.string().url().optional(),
  STORAGE_FORCE_PATH_STYLE: z
    .union([z.boolean(), z.string()])
    .transform((value) => value === true || value === 'true')
    .default(false),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  const parsed = envSchema.safeParse(config);

  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid environment variables: ${message}`);
  }

  return parsed.data;
}
