import Link from 'next/link';
import { getFakeCurrentUser } from '../../lib/fake-auth';
import { kv, syncStripeDataToKV } from '../../lib/stripe-sync';

// Sync subscription data on success page load
async function syncSubscriptionData() {
  try {
    const user = getFakeCurrentUser();
    const stripeCustomerId = await kv.get(`stripe:user:${user.id}`);
    
    if (!stripeCustomerId) {
      console.log('[SUCCESS] No Stripe customer ID found for user');
      return;
    }

    console.log(`[SUCCESS] Syncing subscription data for customer: ${stripeCustomerId}`);
    await syncStripeDataToKV(stripeCustomerId);
    console.log('[SUCCESS] Subscription data synced successfully');
  } catch (error) {
    console.error('[SUCCESS] Error syncing subscription data:', error);
  }
}

export default async function Success() {
  // Sync subscription data immediately on page load
  await syncSubscriptionData();
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
            <p className="text-white/70">Thank you for subscribing</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white/90 text-sm">
                Your subscription is now active and you have access to all premium features.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 text-center"
            >
              Go to Dashboard
            </Link>
            
            <a
              href="/api/create-portal-session"
              className="block w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 border border-white/20 text-center"
            >
              Manage Subscription
            </a>
          </div>

          <p className="text-xs text-white/50 mt-4">
            You will receive a confirmation email shortly.
          </p>
        </div>
      </div>
    </div>
  );
}