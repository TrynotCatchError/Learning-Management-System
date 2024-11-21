import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import Stripe from "stripe";

// Initialize Stripe with the provided secret key
const stripe = new Stripe(
  'sk_test_51QGw3aDgLTNBZ9NMzqX79lSajbJFE1wgFzWYmUOMDrAAKcQWrEOIwL0tQyFgGrL8qA7IvZrYXuJxRLNTzHwlG0Js001fyY99tE',
  { apiVersion: '2024-10-28.acacia' }
);

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  const Authsession = await getServerSession(authOptions);

  if (!Authsession || !Authsession.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = Authsession.user;

  try {
   
   
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: params.courseId,
        },
      },
    });

    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price: 'price_1QM4H4DgLTNBZ9NM7Py3VBJ6',
            quantity: 1,
          },
        ],
        mode: 'payment',
        // success_url: `${req.headers.origin}/?success=true`,
        // cancel_url: `${req.headers.origin}/?canceled=true`,
      });
      NextResponse.redirect(session.url);
    


















    // return NextResponse.json({ url: sessionCheckout.url });
  } catch (error) {
    console.error("Error during checkout process:", error);
    return new NextResponse("Server error during checkout", { status: 500 });
  }
}





    //   try {
    //     const product = await stripe.products.create({
    //       name: coursesUnique.title ,
    //       description: coursesUnique.description ,
    //       default_price_data: {
    //         currency: 'usd',
    //         unit_amount: coursesUnique.price, // Amount in cents
    //         recurring: {
    //           interval: 'month',
    //         },
    //       },
    //     });
    
    //     console.log('Success! Here is your product ID:', product.id);
    //     console.log('Success! Here is your price ID:', product.default_price);
    //   } catch (error) {
    //     console.error('Error creating product with price:', error);
    //   }
    // }

   