import Stripe from "stripe";

export const stripe = new Stripe(
  "sk_test_51QGw3aDgLTNBZ9NMzqX79lSajbJFE1wgFzWYmUOMDrAAKcQWrEOIwL0tQyFgGrL8qA7IvZrYXuJxRLNTzHwlG0Js001fyY99tE",
  { apiVersion: "2024-10-28.acacia" }
);
