import { prisma } from '@/lib/prisma';
import AdminProductsClient from './AdminProductsClient';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <AdminProductsClient products={products} />;
}
