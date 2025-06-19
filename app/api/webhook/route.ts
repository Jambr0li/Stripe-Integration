import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, (err as Error).message)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  let subscription: Stripe.Subscription
  let status: string

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.trial_will_end':
      subscription = event.data.object as Stripe.Subscription
      status = subscription.status
      console.log(`Subscription status is ${status}.`)
      // Then define and call a method to handle the subscription trial ending.
      // handleSubscriptionTrialEnding(subscription);
      break
    case 'customer.subscription.deleted':
      subscription = event.data.object as Stripe.Subscription
      status = subscription.status
      console.log(`Subscription status is ${status}.`)
      // Then define and call a method to handle the subscription deleted.
      // handleSubscriptionDeleted(subscriptionDeleted);
      break
    case 'customer.subscription.created':
      subscription = event.data.object as Stripe.Subscription
      status = subscription.status
      console.log(`Subscription status is ${status}.`)
      // Then define and call a method to handle the subscription created.
      // handleSubscriptionCreated(subscription);
      break
    case 'customer.subscription.updated':
      subscription = event.data.object as Stripe.Subscription
      status = subscription.status
      console.log(`Subscription status is ${status}.`)
      // Then define and call a method to handle the subscription update.
      // handleSubscriptionUpdated(subscription);
      break
    case 'entitlements.active_entitlement_summary.updated':
      const entitlementSummary = event.data.object
      console.log(`Active entitlement summary updated for ${entitlementSummary}.`)
      // Then define and call a method to handle active entitlement summary updated
      // handleEntitlementUpdated(entitlementSummary);
      break
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`)
  }

  // Return a 200 response to acknowledge receipt of the event
  return NextResponse.json({ received: true })
} 