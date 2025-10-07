"use client";

import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const SettingsPage = () => {
  const router = useRouter();
  const { user, isAuthenticated, hasHydrated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [hasHydrated, isAuthenticated, router]);

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-white">
        <div className="px-4 py-12 lg:ml-[210px]">
          <div className="max-w-3xl animate-pulse">
            <div className="h-8 w-40 bg-gray-200 rounded mb-6"></div>
            <div className="h-px bg-gray-200 my-2"></div>
            <div className="h-6 w-64 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-48 bg-gray-200 rounded mb-8"></div>
            <div className="h-px bg-gray-200 my-2"></div>
            <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const planLabel = user?.subscription?.plan
    ? user.subscription.plan.charAt(0).toUpperCase() + user.subscription.plan.slice(1)
    : null;

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-12 lg:ml-[210px]">
        <div className="max-w-3xl">
           <h1 className="text-2xl lg:text-3xl font-extrabold text-[#032b41] mb-6">Settings</h1>
           <div className="border-t border-[#e5e7eb] my-2"></div>
           <h2 className="text-xl font-bold text-[#032b41] mb-2">Your Subscription Plan</h2>
          <p className="text-[#032b41] mb-8">{planLabel ?? 'No active subscription'}</p>

          <div className="border-t border-[#e5e7eb] my-2"></div>

          <h2 className="text-xl font-bold text-[#032b41] mb-2">Email</h2>
          <p className="text-[#032b41]">{user?.email ?? '—'}</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;