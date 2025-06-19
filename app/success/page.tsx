'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Success() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [customerEmail, setCustomerEmail] = useState<string>('');

  useEffect(() => {
    if (sessionId) {
      // You could fetch session details here if needed
      // fetch(`/api/checkout-session?session_id=${sessionId}`)
    }
  }, [sessionId]);

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
            <p className="text-white/70">Thank you for subscribing to Premium SaaS</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white/90 text-sm">
                Your subscription is now active and you have access to all premium features.
              </p>
            </div>
            
            {sessionId && (
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white/70 text-xs">Session ID:</p>
                <p className="text-white/90 text-sm font-mono break-all">{sessionId}</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Go to Dashboard
            </button>
            
            <button
              onClick={() => window.location.href = '/api/create-portal-session'}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 border border-white/20"
            >
              Manage Subscription
            </button>
          </div>

          <p className="text-xs text-white/50 mt-4">
            You will receive a confirmation email shortly.
          </p>
        </div>
      </div>
    </div>
  );
}