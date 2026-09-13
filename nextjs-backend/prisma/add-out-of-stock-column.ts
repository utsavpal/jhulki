import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addOutOfStockColumn() {
  console.log('Executing raw SQL to add isOutOfStock column to Supabase Postgres database...');
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "isOutOfStock" BOOLEAN NOT NULL DEFAULT false;
  `);
  console.log('Successfully added isOutOfStock column to Product table in Supabase PostgreSQL!');
}

addOutOfStockColumn()
  .catch(e => console.error('Migration script error:', e))
  .finally(() => prisma.$disconnect());
