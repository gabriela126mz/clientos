import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {

    const body = await req.json()
    const userId = body.userId
    const email = body.email

    if (!userId) {
      return NextResponse.json(
        { error: 'No user id' },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',

      customer_email: email,

      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],

      subscription_data: {
        trial_period_days: 7,
      },

      metadata: {
        user_id: userId,
      },

      success_url:
        `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?payment=success`,

      cancel_url:
        `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?payment=cancel`,
    })

    return NextResponse.json({
      url: session.url,
    })

  } catch (err: any) {

    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}