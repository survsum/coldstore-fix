import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Valid status values and their allowed transitions
const VALID_STATUSES = ['paid', 'shipped', 'delivered'];
const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ['paid'],
  paid:    ['shipped'],
  shipped: ['delivered'],
  delivered: [], // terminal state
};

function isAdmin(req: NextRequest) {
  return req.cookies.get('admin_session')?.value === 'authenticated';
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { orderId, status, trackingId, courier } = body;

    // Validate required fields
    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    // Fetch current order
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Validate status if provided
    if (status) {
      if (!VALID_STATUSES.includes(status)) {
        return NextResponse.json({
          error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
        }, { status: 400 });
      }

      // Validate transition
      const allowed = VALID_TRANSITIONS[order.status] || [];
      if (!allowed.includes(status)) {
        return NextResponse.json({
          error: `Cannot transition from "${order.status}" to "${status}". Allowed: ${allowed.join(', ') || 'none (terminal state)'}`
        }, { status: 422 });
      }

      // Shipping requires trackingId + courier
      if (status === 'shipped') {
        const tid = trackingId || order.trackingId;
        const cour = courier || order.courier;
        if (!tid || !cour) {
          return NextResponse.json({
            error: 'trackingId and courier are required when marking as shipped'
          }, { status: 400 });
        }
      }
    }

    // Build update data
    const updateData: any = { updatedAt: new Date() };
    if (status) updateData.status = status;
    if (trackingId !== undefined) updateData.trackingId = trackingId;
    if (courier !== undefined) updateData.courier = courier;

    // Set timestamps for status changes
    if (status === 'shipped') updateData.shippedAt = new Date();
    if (status === 'delivered') updateData.deliveredAt = new Date();

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    console.error('Order update error:', err);
    return NextResponse.json({ error: 'Update failed: ' + err.message }, { status: 500 });
  }
}
