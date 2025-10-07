import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  try {
    const { plan, priceId, customerEmail, trialDays } = await req.json();

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: 'Stripe secret key is not configured.' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(secretKey);

    // Resolve price ID either from request or env vars
    const monthlyPrice = process.env.STRIPE_PRICE_MONTHLY;
    const yearlyPrice = process.env.STRIPE_PRICE_YEARLY;
    const resolvedPriceId = priceId || (plan === 'yearly' ? yearlyPrice : monthlyPrice);

    if (!resolvedPriceId) {
      return NextResponse.json(
        { error: 'Price ID is missing. Provide priceId or configure STRIPE_PRICE_MONTHLY / STRIPE_PRICE_YEARLY.' },
        { status: 400 }
      );
    }

    const origin = req.nextUrl.origin;
    const successUrl = `${origin}/for-you?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/choose-plan`;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: resolvedPriceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      subscription_data: trialDays ? { trial_period_days: trialDays } : undefined,
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (error: unknown) {
    console.error('Stripe checkout error', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}