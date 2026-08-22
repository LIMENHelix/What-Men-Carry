import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

let stripe: Stripe | null = null;

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripe) stripe = new Stripe(key);
  return stripe;
}

export async function POST(request: NextRequest) {
  try {
    const stripeClient = getStripe();
    if (!stripeClient) {
      return NextResponse.json(
        { error: "Purchases aren't available yet." },
        { status: 503 }
      );
    }

    const { slug, title, price } = await request.json();

    if (!slug || !title || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: title,
              description: 'What Men Carry — A cinematic story about mens mental health',
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?success=true&video=${slug}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?cancelled=true`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
