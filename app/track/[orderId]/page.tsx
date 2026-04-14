import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import TrackingClient from './TrackingClient';
import type { Metadata } from 'next';

type Props = { params: Promise<{ orderId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orderId } = await params;
  return { title: `Track Order #${orderId.slice(-8).toUpperCase()}` };
}

export default async function TrackPage({ params }: Props) {
  const { orderId } = await params;
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) notFound();

  const safeOrder = {
    id: order.id,
    customerName: order.customerName,
    status: order.status,
    trackingId: order.trackingId,
    courier: order.courier,
    total: order.total,
    createdAt: order.createdAt.toISOString(),
    shippedAt: order.shippedAt?.toISOString() ?? null,
    deliveredAt: order.deliveredAt?.toISOString() ?? null,
  };

  return <TrackingClient order={safeOrder} />;
}
