'use client';

import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 px-4">
      <div className="bg-white/30 backdrop-blur-lg rounded-2xl border border-white/40 shadow-xl p-12 mb-8">
      <div 
        dangerouslySetInnerHTML={{
          __html: '<script src="https://studio.anagram.ai/load-experience.js?experienceID=9731a431-12a7-4ba2-81d7-416f1546c847"></script>'
          }}
        />
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Choose Your Payment Provider
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Select which payment system you&apos;d like to test.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Link href="/stripe" className="group">
            <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-12 transition-all duration-300 hover:scale-105 hover:border-blue-400/50">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.532 0-4.128-2.524-5.851-6.591-7.505h0z"/>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Stripe</h2>
                <p className="text-white/70 mb-6">
                  Test our Stripe integration with multiple pricing tiers and subscription management.
                </p>
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 px-6 rounded-lg group-hover:from-blue-600 group-hover:to-cyan-600 transition-all duration-200">
                  View Stripe Plans
                </div>
              </div>
            </div>
          </Link>

          <Link href="/polar" className="group">
            <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-12 transition-all duration-300 hover:scale-105 hover:border-purple-400/50">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Polar</h2>
                <p className="text-white/70 mb-6">
                  Test our Polar integration for developer-focused subscription management.
                </p>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-200">
                  View Polar Plans
                </div>
              </div>
            </div>
          </Link>

          <Link href="/chat" className="group">
            <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-12 transition-all duration-300 hover:scale-105 hover:border-purple-400/50">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Chat</h2>
                <p className="text-white/70 mb-6">
                  Test our Chat integration for developer-focused subscription management.
                </p>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-200">
                  View Chat
                </div>
              </div>
            </div>
          </Link>
          
        </div>

        <div className="text-center mt-12">
          <p className="text-white/60 text-sm">
            Both integrations are in sandbox/test mode for safe testing.
          </p>
        </div>
      </div>
    </div>
  );
}