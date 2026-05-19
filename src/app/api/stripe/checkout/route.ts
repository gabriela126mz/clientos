import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST() {
  try {
    if (!process.env.STRIPE_PRICE_ID) {
      return NextResponse.json(
        { error: 'Falta STRIPE_PRICE_ID en variables de entorno' },
        { status: 500 }
      )
    }

    if (!process.env.NEXT_PUBLIC_SITE_URL) {
      return NextResponse.json(
        { error: 'Falta NEXT_PUBLIC_SITE_URL en variables de entorno' },
        { status: 500 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],

      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],

      subscription_data: {
        trial_period_days: 7,
      },

      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?canceled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Error creando checkout' },
      { status: 500 }
    )
  }
}