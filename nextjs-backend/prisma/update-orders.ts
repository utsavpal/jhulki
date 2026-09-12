import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateExistingOrders() {
  const targetOrderNumbers = ['JHL-350401', 'JHL-560405'];

  for (const num of targetOrderNumbers) {
    const order = await prisma.order.findUnique({
      where: { orderNumber: num }
    });

    if (order) {
      console.log(`Updating Order ${num}: TotalAmount = ${order.totalAmount}`);
      await prisma.order.update({
        where: { id: order.id },
        data: {
          advancePaid: order.totalAmount,
          balanceDue: 0,
          isBalancePaid: true
        }
      });
      console.log(`✓ Order ${num} updated: advancePaid = ${order.totalAmount}, balanceDue = 0, isBalancePaid = true`);
    } else {
      console.log(`Order ${num} not found in database.`);
    }
  }

  // Also check if any other order exists that should be marked as full payment
  const allOrders = await prisma.order.findMany();
  console.log('All Orders Status Summary:');
  for (const o of allOrders) {
    console.log(`Order #${o.orderNumber}: totalAmount=${o.totalAmount}, advancePaid=${o.advancePaid}, balanceDue=${o.balanceDue}, isBalancePaid=${o.isBalancePaid}, paymentMethod="${o.paymentMethod}"`);
  }
}

updateExistingOrders()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
