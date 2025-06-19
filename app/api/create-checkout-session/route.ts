import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})
// lookup_key = anagram-basic-monthly
const YOUR_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { lookup_key } = body

    const prices = await stripe.prices.list({
      lookup_keys: [lookup_key],
      expand: ['data.product'],
    })

    const session = await stripe.checkout.sessions.create({
      billing_address_collection: 'auto',
      line_items: [
        {
          price: prices.data[0].id,
          // For metered billing, do not pass quantity
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${YOUR_DOMAIN}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}?canceled=true`,
    })

    return NextResponse.redirect(session.url!, 303)
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
} 