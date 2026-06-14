import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { defineConfig } from 'prisma/config';

const envFiles = ['.env.local', '.env'];

for (const file of envFiles) {
  const filePath = path.resolve(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    dotenv.config({ path: filePath, override: false });
  }
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'ts-node --transpile-only prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL ?? '',
  },
});
