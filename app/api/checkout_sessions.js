import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51QGw3aDgLTNBZ9NMzqX79lSajbJFE1wgFzWYmUOMDrAAKcQWrEOIwL0tQyFgGrL8qA7IvZrYXuJxRLNTzHwlG0Js001fyY99tE', { apiVersion: '2022-11-15' });

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Create a product and its associated price
      const product = await stripe.products.create({
        name: 'This I',
        description: '$12/Month subscription12121212',
      });

      const price = await stripe.prices.create({
        unit_amount: 1430, // Amount in cents
        currency: 'usd',
        product: product.id,
      });

      console.log('Product ID:', product.id);
      console.log('Price ID:', price.id);

      // Use the price ID to create a Checkout session
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: price.id, // Use the price ID here
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
      });

      res.redirect(303, session.url);
    } catch (err) {
      console.error('Error:', err);
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
