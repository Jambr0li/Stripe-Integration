'use client';

import { useState } from 'react';

interface PricingCardProps {
  title: string;
  price: number;
  lookupKey: string;
  features: string[];
  popular?: boolean;
  gradient: string;
  badge?: string;
}

function PricingCard({ title, price, lookupKey, features, popular, gradient, badge }: PricingCardProps) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/polar/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lookup_key: lookupKey,
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative bg-white/10 backdrop-blur-lg rounded-2xl border ${popular ? 'border-yellow-400/50 shadow-2xl scale-105' : 'border-white/20'} shadow-xl p-8 ${popular ? 'ring-2 ring-yellow-400/30' : ''}`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-sm font-bold px-4 py-2 rounded-full">
            MOST POPULAR
          </span>
        </div>
      )}
      
      {badge && (
        <div className="absolute -top-3 -right-3">
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            {badge}
          </span>
        </div>
      )}

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <div className="text-4xl font-bold text-white mb-2">
          ${price.toLocaleString()}
        </div>
        <div className="text-white/70">per month</div>
      </div>

      <div className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center text-white/90">
            <svg className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubscribe}
        disabled={loading}
        className={`w-full ${gradient} disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105`}
      >
        {loading ? 'Processing...' : 'Subscribe Now'}
      </button>

      <p className="text-xs text-white/50 text-center mt-4">
        Cancel anytime. No setup fees.
      </p>
    </div>
  );
}

export default function Home() {
  const plans: PricingCardProps[] = [
    {
      title: "Novice",
      price: 1,
      lookupKey: "anagram-novice-monthly",
      features: [
        "Basic Dashboard",
        "5 Projects",
        "Email Support",
        "1GB Storage",
        "Basic Analytics"
      ],
      gradient: "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            POLAR - Choose Your Plan - POLAR
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Select the perfect subscription tier for your needs. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <PricingCard key={plan.lookupKey} {...plan} />
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-white/60 text-sm">
            All plans include a 14-day free trial. No credit card required to start.
          </p>
        </div>
      </div>
    </div>
  );
}
