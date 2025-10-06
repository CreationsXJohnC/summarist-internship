'use client';

import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';

export default function ChoosePlanPage() {
  const user = useAppSelector((s) => s.auth.user);

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const prices = {
    monthly: {
      label: 'Monthly',
      amountDisplay: '$9.99/mo',
      // Price ID resolved on server from env STRIPE_PRICE_MONTHLY
      trialDays: 0,
    },
    yearly: {
      label: 'Yearly',
      amountDisplay: '$99.99/yr',
      // 7-day free trial for yearly
      trialDays: 7,
    },
  };

  async function startCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: billingCycle,
          customerEmail: user?.email || undefined,
          trialDays: prices[billingCycle].trialDays,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to start checkout');
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const faqs = [
    {
      q: 'Can I cancel anytime?',
      a: 'Yes. You can cancel your subscription anytime from your account billing portal.',
    },
    {
      q: 'Do you offer a free trial?',
      a: 'The yearly plan includes a 7-day free trial. You will not be charged if you cancel within the trial period.',
    },
    {
      q: 'Will my subscription renew automatically?',
      a: 'Yes, your subscription automatically renews until you cancel. You can manage renewal from the billing portal.',
    },
    {
      q: 'What payment methods are accepted?',
      a: 'Major credit and debit cards are supported.',
    },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 text-[#032b41]">
      {/* Hero */}
      <div className="container mx-auto px-6 py-14">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-gray-700 mb-8">
            Unlock unlimited access to book summaries and audio versions. Switch or cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white border border-gray-200 rounded-lg p-1 mb-8 shadow-sm">
            <button
              className={`px-5 py-2 rounded-md font-semibold transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-[#2bd97c] text-white'
                  : 'text-[#032b41] hover:bg-gray-100'
              }`}
              onClick={() => setBillingCycle('monthly')}
              aria-pressed={billingCycle === 'monthly'}
            >
              Monthly
            </button>
            <button
              className={`px-5 py-2 rounded-md font-semibold transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-[#2bd97c] text-white'
                  : 'text-[#032b41] hover:bg-gray-100'
              }`}
              onClick={() => setBillingCycle('yearly')}
              aria-pressed={billingCycle === 'yearly'}
            >
              Yearly
            </button>
          </div>

          {/* Pricing Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-2">Free</h2>
              <p className="text-3xl font-bold mb-2">$0</p>
              <p className="text-gray-600 mb-6">Explore summaries with limited access.</p>
              <ul className="text-left space-y-2 text-gray-700 mb-6">
                <li>• Limited summaries</li>
                <li>• No offline access</li>
                <li>• Community support</li>
              </ul>
              <button className="w-full bg-gray-200 text-[#032b41] px-6 py-2 rounded-lg font-semibold cursor-not-allowed">
                Current Plan
              </button>
            </div>

            {/* Pro */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">Pro</h2>
                <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
              <p className="text-3xl font-bold mb-2">{prices[billingCycle].amountDisplay}</p>
              {billingCycle === 'yearly' && (
                <p className="text-sm text-green-700 mb-4">Includes a 7-day free trial</p>
              )}
              <p className="text-gray-600 mb-6">Unlimited summaries and audio versions, curated collections, and more.</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-gray-700 mb-8 text-left">
                <li>• Unlimited summaries</li>
                <li>• Audio versions</li>
                <li>• Personalized recommendations</li>
                <li>• Offline access</li>
                <li>• Priority support</li>
                <li>• Early access to new titles</li>
              </ul>

              {error && (
                <div className="mb-4 text-red-600 text-sm">{error}</div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={startCheckout}
                  disabled={loading}
                  className={`flex-1 bg-[#2bd97c] text-white px-6 py-3 rounded-lg font-semibold transition-colors ${
                    loading ? 'opacity-70 cursor-wait' : 'hover:bg-[#25c470]'
                  }`}
                >
                  {loading ? 'Starting Checkout…' : 'Get Pro'}
                </button>
                <button
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                  className="px-6 py-3 rounded-lg font-semibold border border-[#032b41] text-[#032b41] hover:bg-[#2bd97c] hover:text-[#032b41]"
                >
                  Switch to {billingCycle === 'monthly' ? 'Yearly' : 'Monthly'}
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-3">
                By subscribing, you agree to our Terms and Privacy Policy. You can cancel anytime.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="container mx-auto px-6 pb-20">
        <h3 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h3>
        <div className="max-w-3xl mx-auto">
          {faqs.map((item, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-lg mb-3 overflow-hidden">
              <button
                className="w-full text-left px-5 py-4 flex items-center justify-between"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                aria-expanded={openFaq === idx}
              >
                <span className="font-semibold">{item.q}</span>
                <span className="material-symbols-outlined">
                  {openFaq === idx ? 'expand_less' : 'expand_more'}
                </span>
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-4 text-gray-700">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}