import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/userAuth';

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      // Order details to save
      customerName,
      email,
      address,
      items,
      total,
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment fields' }, { status: 400 });
    }

    // Verify the signature — HMAC SHA256
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }

    // Save the order, linking to user if logged in
    const userPayload = await getUserFromRequest(req);
    const order = await prisma.order.create({
      data: {
        customerName,
        email,
        address,
        items: JSON.stringify(items),
        total: parseFloat(total),
        status: 'paid',
        userId: userPayload?.id || null,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      paymentId: razorpay_payment_id,
    });
  } catch (error: any) {
    console.error('Razorpay verify error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
