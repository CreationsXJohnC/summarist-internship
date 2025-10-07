import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  try {
    const { customerId } = await req.json();

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: 'Stripe secret key is not configured.' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(secretKey);

    const origin = req.nextUrl.origin;
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/for-you`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error('Stripe portal error', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}