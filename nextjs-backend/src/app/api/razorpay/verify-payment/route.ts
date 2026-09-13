import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { corsHeaders, handleCors } from '@/lib/cors';

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return handleCors();
}

export async function POST(req: NextRequest) {
  try {
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_secret) {
      return NextResponse.json(
        { error: 'RAZORPAY_KEY_SECRET is missing in environment variables.' },
        { status: 500, headers: corsHeaders() }
      );
    }

    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required Razorpay payment verification fields.' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature. Verification failed.' },
        { status: 400, headers: corsHeaders() }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Razorpay payment verified successfully',
        razorpay_order_id,
        razorpay_payment_id,
      },
      { status: 200, headers: corsHeaders() }
    );
  } catch (error: any) {
    console.error('[Razorpay Verify Payment Error]', error);
    return NextResponse.json(
      { error: error?.message || 'Payment signature verification failed' },
      { status: 500, headers: corsHeaders() }
    );
  }
}
