'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface Reputation {
  average: number;
  count: number;
  badges: string[];
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [reputation, setReputation] = useState<Reputation | null>(null);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:4000/ratings/summary/user/${user.id}`)
        .then(res => res.json())
        .then(data => setReputation(data));
    }
  }, [user]);

  if (!user) return <div className="p-8 text-center">Please login</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-lg flex items-center gap-6">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-3xl font-bold text-blue-600">
          {user.displayName?.[0] || 'U'}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{user.displayName || 'Anonymous'}</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border text-center">
          <h3 className="text-sm font-bold text-gray-400 uppercase">Average Rating</h3>
          <p className="text-4xl font-bold text-blue-600">{reputation?.average || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border text-center">
          <h3 className="text-sm font-bold text-gray-400 uppercase">Total Ratings</h3>
          <p className="text-4xl font-bold text-gray-800">{reputation?.count || 0}</p>
        </div>
      </div>

      {reputation && reputation.badges.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Badges</h3>
          <div className="flex flex-wrap gap-2">
            {reputation.badges.map(badge => (
              <span key={badge} className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
                🏆 {badge}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

