import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature') || '';
  const body = await req.text();

  try {
    // Replace with your Stripe signing secret
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    // Handle event types
    switch (event.type) {
      case 'checkout.session.completed':
        console.log('Payment succeeded:', event.data.object);
        break;
      default:
        console.warn('Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return new NextResponse(err.message, { status: 400 });
  }
}
