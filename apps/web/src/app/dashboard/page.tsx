'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { TRANSLATIONS } from '@norijjak/shared';

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const t = TRANSLATIONS['ko-KR'];

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user && user.onboardingStep !== 'DONE') {
      router.push('/onboarding');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{t.app_name} Dashboard</h1>
          <button
            onClick={logout}
            className="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50"
          >
            Logout
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-md">
            <h2 className="font-semibold text-blue-800">User Profile</h2>
            <p>Email: {user.email}</p>
            <p>Locale: {user.locale}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 border rounded-lg text-center">
              <h3 className="font-bold">{t.landing.find_games}</h3>
              <p className="text-sm text-gray-500">Feature coming soon</p>
            </div>
            <div className="p-6 border rounded-lg text-center">
              <h3 className="font-bold">{t.landing.book_venues}</h3>
              <p className="text-sm text-gray-500">Feature coming soon</p>
            </div>
            <div className="p-6 border rounded-lg text-center">
              <h3 className="font-bold">{t.landing.achievements}</h3>
              <p className="text-sm text-gray-500">Feature coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

