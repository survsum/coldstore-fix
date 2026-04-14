import { NextRequest, NextResponse } from 'next/server';

// Lazy init — prevents build crash when env vars aren't set at build time
function getRazorpay() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials not configured');
  }
  // Dynamic import so it's not bundled into the edge runtime
  const Razorpay = require('razorpay');
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = 'INR', receipt } = await req.json();
    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    });

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Razorpay order error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
