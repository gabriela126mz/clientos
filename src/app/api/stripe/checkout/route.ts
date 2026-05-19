import { stripe } from "@/lib/stripe"
import { NextResponse } from "next/server"

export async function POST(req: Request) {

  const { userId, email } = await req.json()

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",

    line_items: [
      {
        price: "price_TU_ID_AQUI",
        quantity: 1
      }
    ],

    subscription_data: {
      trial_period_days: 7
    },

    metadata: {
      userId,
      email
    },

    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`
  })

  return NextResponse.json({ url: session.url })
}