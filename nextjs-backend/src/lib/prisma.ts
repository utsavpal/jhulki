import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Official Supabase Connection Pooler (AWS ap-northeast-2 region)
const VERIFIED_POOLER_URL = 'postgresql://postgres.oejbnxhrxfrwppozaphg:jhulki%400919@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true&connect_timeout=30';

function getDbUrl(): string {
  let envUrl = process.env.DATABASE_URL;
  if (!envUrl || !envUrl.trim()) return VERIFIED_POOLER_URL;
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










