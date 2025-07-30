import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getFakeCurrentUser } from '../../../lib/fake-auth'
import { kv } from '../../../lib/stripe-sync'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

const YOUR_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN 
  ? `https://${process.env.NEXT_PUBLIC_DOMAIN}` 
  : 'http://localhost:3000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { lookup_key } = body

    // Get the current user (fake auth for demo)
    const user = getFakeCurrentUser()
    console.log(`[CHECKOUT] Creating checkout for user: ${user.id} (${user.email})`)

    // Get the stripeCustomerId from your KV store
    let stripeCustomerId = await kv.get(`stripe:user:${user.id}`)

    // Create a new Stripe customer if this user doesn't have one
    if (!stripeCustomerId) {
      console.log(`[CHECKOUT] Creating new Stripe customer for user ${user.id}`)
      const newCustomer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id, // DO NOT FORGET THIS
        },
      })

      // Store the relation between userId and stripeCustomerId in your KV
      await kv.set(`stripe:user:${user.id}`, newCustomer.id)
      stripeCustomerId = newCustomer.id
      console.log(`[CHECKOUT] Created Stripe customer: ${stripeCustomerId}`)
    } else {
      console.log(`[CHECKOUT] Using existing Stripe customer: ${stripeCustomerId}`)
    }

    const prices = await stripe.prices.list({
      lookup_keys: [lookup_key],
      expand: ['data.product'],
    })

    // ALWAYS create a checkout with a stripeCustomerId. They should enforce this.
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId, // Key change: always include customer
      billing_address_collection: 'auto',
      line_items: [
        {
          price: prices.data[0].id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${YOUR_DOMAIN}/success`,
      cancel_url: `${YOUR_DOMAIN}/canceled`,
    })

    console.log(`[CHECKOUT] Created checkout session: ${session.id}`)
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
} 