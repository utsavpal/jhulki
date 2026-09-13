import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { corsHeaders, handleCors } from '@/lib/cors';

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return handleCors();
}

export async function POST(req: NextRequest) {
  try {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return NextResponse.json(
        { error: 'Razorpay API keys are missing in environment variables.' },
        { status: 500, headers: corsHeaders() }
      );
    }

    const body = await req.json();
    const { amount, currency = 'INR', receipt } = body;

    // Validate amount in paise (minimum 100 paise = ₹1)
    const amountInPaise = Math.round(Number(amount));

    if (!amountInPaise || isNaN(amountInPaise) || amountInPaise < 100) {
      return NextResponse.json(
        { error: 'Invalid amount. Minimum amount is 100 paise (₹1).' },
        { status: 400, headers: corsHeaders() }
      );
    }

    const instance = new Razorpay({
      key_id,
      key_secret,
    });

    const options = {
      amount: amountInPaise,
      currency: currency.toUpperCase(),
      receipt: receipt || `rcpt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    return NextResponse.json(
      {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: key_id,
      },
      { status: 201, headers: corsHeaders() }
    );
  } catch (error: any) {
    console.error('[Razorpay Create Order Error]', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create Razorpay order' },
      { status: 500, headers: corsHeaders() }
    );
  }
}
