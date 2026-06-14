import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';

const email = process.env.SEED_SUPER_ADMIN_EMAIL ?? 'reservas@pesdoparana.com.br';
const name = process.env.SEED_SUPER_ADMIN_NAME ?? 'Pés do Paraná';
const password = process.env.SEED_SUPER_ADMIN_PASSWORD ?? 'Reservas@2026';
const phone = process.env.SEED_SUPER_ADMIN_PHONE ?? null;

function normalizePreferences(value: unknown) {
  if (value === null || value === undefined) {
    return undefined;
  }

  return value as Prisma.InputJsonValue;
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is required');
  }

  const pool = new Pool({ connectionString });
  const prisma = new PrismaClient({
    adapter: new PrismaPg(pool),
  });

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const preferences = normalizePreferences({
      theme: 'system',
      sidebarCollapsed: false,
      defaultDashboardView: 'events',
    });

    await prisma.user.upsert({
      where: { email },
      create: {
        name,
        email,
        passwordHash,
        role: 'super_admin',
        status: 'ACTIVE',
        avatarUrl: null,
        phone,
        preferences,
      },
      update: {
        name,
        passwordHash,
        role: 'super_admin',
        status: 'ACTIVE',
        avatarUrl: null,
        phone,
        preferences,
      },
    });

    console.log(`Seed concluído para ${email}`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch(async (error) => {
  console.error(error);
  process.exitCode = 1;
});
