import Stripe from 'stripe'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {

  const body = await req.text()
  
const signature = (await headers()).get('stripe-signature')!

  let event: Stripe.Event

  try {

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

  } catch (err: any) {

    return new Response(
      `Webhook Error: ${err.message}`,
      { status: 400 }
    )
  }

  if (event.type === 'checkout.session.completed') {

    const session =
      event.data.object as Stripe.Checkout.Session

    const userId = session.metadata?.user_id

    if (userId) {

      await supabase
        .from('profiles')
        .update({
          plan: 'pro',
          stripe_customer_id: session.customer,
        })
        .eq('id', userId)
    }
  }

  return new Response('ok', {
    status: 200,
  })
}