// import { NextResponse } from "next/server";
// import Stripe from "stripe";
// import { db } from "@/lib/db";

// // Initialize Stripe with the provided secret key
// const stripe = new Stripe(
//   "sk_test_51QGw3aDgLTNBZ9NMzqX79lSajbJFE1wgFzWYmUOMDrAAKcQWrEOIwL0tQyFgGrL8qA7IvZrYXuJxRLNTzHwlG0Js001fyY99tE",
//   { apiVersion: "2022-11-15" }
// );

// export async function POST(req: Request) {
//   const sig = req.headers.get("stripe-signature");

//   if (!sig) {
//     return new NextResponse("Missing Stripe signature", { status: 400 });
//   }

//   const payload = await req.text();

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       payload,
//       sig,
//       "whsec_12345" // Use your webhook secret
//     );
//   } catch (err) {
//     console.error("Error verifying webhook signature:", err.message);
//     return new NextResponse("Webhook signature verification failed", {
//       status: 400,
//     });
//   }

//   try {
//     if (event.type === "checkout.session.completed") {
//       const session = event.data.object as Stripe.Checkout.Session;

//       const courseId = session.metadata?.courseId;
//       const userId = session.metadata?.userId;

//       if (courseId && userId) {
//         await db.purchase.create({
//           data: {
//             courseId,
//             userId,
//           },
//         });
//       }
//     }

//     return new NextResponse("Webhook handled", { status: 200 });
//   } catch (error) {
//     console.error("Error processing webhook:", error);
//     return new NextResponse("Server error during webhook processing", {
//       status: 500,
//     });
//   }
// }
