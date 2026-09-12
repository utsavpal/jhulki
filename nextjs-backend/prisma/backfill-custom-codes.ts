import { PrismaClient } from '@prisma/client';
import { getCategoryPrefix, generateCustomProductCode } from '../src/lib/custom-id';

const prisma = new PrismaClient();

async function backfillCustomCodes() {
  console.log('Backfilling custom product codes for all existing products...');

  const categories = await prisma.category.findMany({
    include: {
      products: {
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  for (const cat of categories) {
    const prefix = getCategoryPrefix(cat.slug || cat.name);
    console.log(`Processing category: ${cat.name} (${cat.slug}) -> Prefix: ${prefix}`);

    let seq = 1;
    for (const prod of cat.products) {
      const code = generateCustomProductCode(prefix, new Date(prod.createdAt), seq);
      console.log(`Setting product "${prod.name}" -> ${code}`);
      await prisma.product.update({
        where: { id: prod.id },
        data: { customCode: code }
      });
      seq++;
    }
  }

  console.log('All existing products updated successfully with unique Custom Product IDs!');
}

backfillCustomCodes()
  .catch((e) => {
    console.error('Error backfilling custom codes:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
