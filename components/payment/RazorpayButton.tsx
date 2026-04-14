'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

interface RazorpayButtonProps {
  amount: number;    // grand total in INR — sent to Razorpay
  currency?: string;
  customerName: string;
  email: string;
  address: string;
  items: any[];
  total: number;     // same value forwarded to verify route for DB
  onSuccess: (paymentId: string, orderId: string) => void;
  onFailure?: (error: any) => void;
  disabled?: boolean;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function RazorpayButton({
  amount,
  currency = 'INR',
  customerName,
  email,
  address,
  items,
  total,
  onSuccess,
  onFailure,
  disabled,
}: RazorpayButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!customerName || !email || !address) {
      toast.error('Please fill in your contact and shipping details first.');
      return;
    }

    setLoading(true);

    try {
      // 1. Load Razorpay checkout SDK
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Failed to load Razorpay. Check your internet connection.');
        setLoading(false);
        return;
      }

      // 2. Create Razorpay order on our backend
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency, receipt: `rcpt_${Date.now()}` }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        throw new Error(err.error || 'Failed to create payment order');
      }

      const razorpayOrder = await orderRes.json();

      // 3. Open Razorpay modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Cold Dog Store',
        description: `Order of ${items.length} item${items.length !== 1 ? 's' : ''}`,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop',
        order_id: razorpayOrder.id,
        prefill: {
          name: customerName,
          email: email,
          contact: '',
        },
        theme: {
          color: '#c9973d',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast('Payment cancelled', { icon: '⚠️' });
          },
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // 4. Verify signature server-side and save order
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                customerName,
                email,
                address,
                items,
                total,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || 'Payment verification failed');
            }

            onSuccess(response.razorpay_payment_id, verifyData.orderId);
          } catch (err: any) {
            toast.error('Payment verification failed. Please contact support.');
            onFailure?.(err);
          } finally {
            setLoading(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        toast.error(`Payment failed: ${response.error.description}`);
        onFailure?.(response.error);
        setLoading(false);
      });
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
      onFailure?.(err);
      setLoading(false);
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handlePayment}
      disabled={disabled || loading}
      whileTap={{ scale: 0.97 }}
      className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-white text-sm font-medium transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        background: loading
          ? 'var(--text-muted)'
          : 'linear-gradient(135deg, #c9973d 0%, #a67c2e 100%)',
        boxShadow: loading ? 'none' : '0 4px 20px rgba(201,151,61,0.35)',
      }}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Opening Razorpay...
        </>
      ) : (
        <>
          <CreditCard size={16} />
          Pay ₹{amount.toFixed(0)} with Razorpay
        </>
      )}
    </motion.button>
  );
}
