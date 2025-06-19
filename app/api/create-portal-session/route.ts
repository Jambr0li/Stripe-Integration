import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

const YOUR_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { session_id } = body

    // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
    // Typically this is stored alongside the authenticated user in your database.
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id)

    // This is the url to which the customer will be redirected when they're done
    // managing their billing with the portal.
    const returnUrl = YOUR_DOMAIN

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: checkoutSession.customer as string,
      return_url: returnUrl,
    })

    return NextResponse.redirect(portalSession.url, 303)
  } catch (error) {
    console.error('Error creating portal session:', error)
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    )
  }
} 