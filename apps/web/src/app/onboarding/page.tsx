'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { TRANSLATIONS } from '@norijjak/shared';

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const t = TRANSLATIONS['ko-KR']; // Simplified for now

  const [displayName, setDisplayName] = useState('');
  const [homeArea, setHomeArea] = useState('');
  const [sports, setSports] = useState<string[]>([]);
  const [availableSports, setAvailableSports] = useState<{ id: string; name_ko: string; name_en: string }[]>([]);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    
    fetch('http://localhost:4000/sports')
      .then(res => res.json())
      .then(data => setAvailableSports(data.sports));
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Update Profile
    await fetch('http://localhost:4000/user/profile', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Simplified
      },
      body: JSON.stringify({ displayName }),
    });

    // 2. Update Preferences
    await fetch('http://localhost:4000/user/preferences', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ 
        homeArea, 
        sports: sports.map(sId => ({ sportId: sId, level: 'BEGINNER' })) 
      }),
    });

    router.push('/dashboard');
  };

  if (loading || !user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center">{t.onboarding.title}</h1>
        <p className="text-gray-500 text-center mb-8">{t.onboarding.subtitle}</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">{t.onboarding.display_name}</label>
            <input 
              className="w-full border rounded-md px-3 py-2"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t.onboarding.home_area}</label>
            <input 
              className="w-full border rounded-md px-3 py-2"
              placeholder="e.g. Seoul, Gangnam"
              value={homeArea}
              onChange={(e) => setHomeArea(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t.onboarding.select_sports}</label>
            <div className="grid grid-cols-2 gap-2">
              {availableSports.map(sport => (
                <button
                  key={sport.id}
                  type="button"
                  onClick={() => {
                    setSports(prev => prev.includes(sport.id) ? prev.filter(id => id !== sport.id) : [...prev, sport.id])
                  }}
                  className={`px-3 py-2 text-sm border rounded-full transition-colors ${sports.includes(sport.id) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-50'}`}
                >
                  {sport.name_ko}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700"
          >
            {t.onboarding.complete}
          </button>
        </form>
      </div>
    </div>
  );
}

