import { prisma } from '@/lib/prisma';
import AdminOrdersClient from './AdminOrdersClient';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const ordersWithParsedItems = orders.map((o) => ({
    ...o,
    parsedItems: (() => {
      try { return JSON.parse(o.items); }
      catch { return []; }
    })(),
  }));

  return <AdminOrdersClient orders={ordersWithParsedItems} />;
}
