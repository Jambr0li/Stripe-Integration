import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

const YOUR_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN 
  ? `https://${process.env.NEXT_PUBLIC_DOMAIN}` 
  : 'http://localhost:3000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer_id } = body

    const returnUrl = YOUR_DOMAIN

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customer_id,
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