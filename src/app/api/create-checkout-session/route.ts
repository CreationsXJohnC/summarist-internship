import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const { plan, priceId, customerEmail, trialDays } = await req.json();

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Stripe secret key is not configured.' }, { status: 500 });
    }

    // Resolve price ID either from request or env vars
    const monthlyPrice = process.env.STRIPE_PRICE_MONTHLY;
    const yearlyPrice = process.env.STRIPE_PRICE_YEARLY;
    const resolvedPriceId = priceId || (plan === 'yearly' ? yearlyPrice : monthlyPrice);

    if (!resolvedPriceId) {
      return NextResponse.json({ error: 'Price ID is missing. Provide priceId or configure STRIPE_PRICE_MONTHLY / STRIPE_PRICE_YEARLY.' }, { status: 400 });
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
  } catch (error: any) {
    console.error('Stripe checkout error', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}