import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51QGw3aDgLTNBZ9NMzqX79lSajbJFE1wgFzWYmUOMDrAAKcQWrEOIwL0tQyFgGrL8qA7IvZrYXuJxRLNTzHwlG0Js001fyY99tE', {
  apiVersion: "2024-10-28.acacia",
});

export async function POST(req: NextRequest) {
  try {
    const product = await stripe.products.create({
      name: 'This I',
      description: '$12/Month subscription12121212',
    });

    const price = await stripe.prices.create({
      unit_amount: 1430, // Amount in cents
      currency: 'usd',
      product: product.id,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.nextUrl.origin}/?success=true`,
      cancel_url: `${req.nextUrl.origin}/?canceled=true`,
    });

    return NextResponse.redirect(session.url || '', 303);
  } catch (err: any) {
    return new NextResponse(err.message, { status: err.statusCode || 500 });
  }
}
