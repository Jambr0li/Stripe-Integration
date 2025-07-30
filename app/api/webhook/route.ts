import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { processStripeEvent } from '../../../lib/stripe-sync'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Utility function to handle async operations safely
async function tryCatch<T>(fn: () => Promise<T>): Promise<{ result?: T; error?: Error }> {
  try {
    const result = await fn()
    return { result }
  } catch (error) {
    return { error: error as Error }
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature') as string

  if (!signature) return NextResponse.json({}, { status: 400 })

  async function doEventProcessing() {
    if (typeof signature !== "string") {
      throw new Error("[STRIPE HOOK] Header isn't a string???")
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      endpointSecret
    )

    console.log(`[STRIPE WEBHOOK] Received event: ${event.type}`)
    
    // Process the event using our simplified sync approach
    await processStripeEvent(event)
  }

  const { error } = await tryCatch(doEventProcessing)

  if (error) {
    console.error("[STRIPE HOOK] Error processing event", error)
  }

  return NextResponse.json({ received: true })
} 