import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Official Supabase Connection Pooler (AWS ap-northeast-2 region)
const VERIFIED_POOLER_URL = 'postgresql://postgres.oejbnxhrxfrwppozaphg:jhulki%400919@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true&connect_timeout=30';

// Force override process.env.DATABASE_URL so Vercel's legacy/corrupted env var doesn't take precedence
process.env.DATABASE_URL = VERIFIED_POOLER_URL;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: VERIFIED_POOLER_URL,
      },
    },
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;











