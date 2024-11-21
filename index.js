const stripe = require('stripe')('sk_test_51QGw3aDgLTNBZ9NMzqX79lSajbJFE1wgFzWYmUOMDrAAKcQWrEOIwL0tQyFgGrL8qA7IvZrYXuJxRLNTzHwlG0Js001fyY99tE')
stripe.products.create({
  name: 'this i',
  description: '$12/Month subscription12121212',
}).then(product => {
  stripe.prices.create({
    unit_amount: 430,
    currency: 'usd',
    recurring: {
      interval: 'month',
    },
    product: product.id,
  }).then(price => {
    console.log('Success! Here is your starter subscription product id: ' + product.id);
    console.log('Success! Here is your starter subscription price id: ' + price.id);
  });
});