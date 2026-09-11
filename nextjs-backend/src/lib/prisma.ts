import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const DIRECT_DB_URL = 'postgresql://postgres:jhulki%400919@db.oejbnxhrxfrwppozaphg.supabase.co:5432/postgres?sslmode=require&connect_timeout=30';

function getDbUrl(): string {
  let envUrl = process.env.DATABASE_URL;
  if (!envUrl || !envUrl.trim()) return DIRECT_DB_URL;
  envUrl = envUrl.trim();
  if ((envUrl.startsWith('"') && envUrl.endsWith('"')) || (envUrl.startsWith("'") && envUrl.endsWith("'"))) {
    envUrl = envUrl.slice(1, -1).trim();
  }
  return envUrl;
}

const dbUrl = getDbUrl();

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;









