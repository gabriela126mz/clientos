import { stripe } from "@/lib/stripe"
import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {

  const body = await req.text()
  const sig = (await headers()).get("stripe-signature")!

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return new NextResponse("error", { status: 400 })
  }

  if (event.type === "checkout.session.completed") {

    const session = event.data.object
    const userId = session.metadata?.userId

    await supabase
      .from("profiles")
      .update({
        is_premium: true,
        stripe_customer_id: session.customer
      })
      .eq("id", userId)
  }

  return NextResponse.json({ ok: true })
}