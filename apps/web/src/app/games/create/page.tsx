'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TRANSLATIONS } from '@norijjak/shared';

interface Sport {
  id: string;
  name_ko: string;
}

export default function CreateGamePage() {
  const router = useRouter();
  const t = TRANSLATIONS['ko-KR'];

  const [availableSports, setAvailableSports] = useState<Sport[]>([]);
  const [venues, setVenues] = useState<{ id: string; name: string }[]>([]);
  const [userClubs, setUserClubs] = useState<{ id: string; name: string }[]>([]);
  const [formData, setFormData] = useState({
    sportId: '',
    venueId: '',
    clubId: '',
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    homeArea: '',
    capacity: 10,
    visibility: 'PUBLIC',
    joinPolicy: 'OPEN',
  });

  useEffect(() => {
    fetch('http://localhost:4000/sports')
      .then(res => res.json())
      .then(data => setAvailableSports(data.sports));

    // Fetch user clubs for club game creation
    fetch('http://localhost:4000/clubs', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        // Simple filter: only clubs where user is approved member
        // In a real app, we'd have a specific /me/clubs endpoint
        setUserClubs(data.clubs || []);
      });
  }, []);

  useEffect(() => {
    if (formData.sportId) {
      fetch(`http://localhost:4000/venues?sportId=${formData.sportId}`)
        .then(res => res.json())
        .then(data => setVenues(data.venues));
    } else {
      setVenues([]);
    }
  }, [formData.sportId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        venueId: formData.venueId || undefined,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
      };
      
      const res = await fetch('http://localhost:4000/games', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }

      router.push('/games');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create game';
      alert(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">{t.games.create_title}</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t.games.sport_label}</label>
            <select 
              className="w-full border rounded-md px-3 py-2"
              value={formData.sportId}
              onChange={(e) => setFormData({ ...formData, sportId: e.target.value })}
              required
            >
              <option value="">종목 선택</option>
              {availableSports.map(s => <option key={s.id} value={s.id}>{s.name_ko}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">장소 (선택 사항)</label>
            <select 
              className="w-full border rounded-md px-3 py-2"
              value={formData.venueId}
              onChange={(e) => setFormData({ ...formData, venueId: e.target.value })}
            >
              <option value="">장소 없음 (직접 입력)</option>
              {venues.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
            {!formData.sportId && <p className="text-xs text-gray-400 mt-1">종목을 먼저 선택하세요.</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">클럽 경기 (선택 사항)</label>
            <select 
              className="w-full border rounded-md px-3 py-2"
              value={formData.clubId}
              onChange={(e) => setFormData({ ...formData, clubId: e.target.value })}
            >
              <option value="">개인 경기</option>
              {userClubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t.games.title_label}</label>
            <input 
              className="w-full border rounded-md px-3 py-2"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">공개 설정</label>
              <select 
                className="w-full border rounded-md px-3 py-2"
                value={formData.visibility}
                onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
              >
                <option value="PUBLIC">{t.games.visibility_public}</option>
                <option value="PRIVATE">{t.games.visibility_private}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">참가 정책</label>
              <select 
                className="w-full border rounded-md px-3 py-2"
                value={formData.joinPolicy}
                onChange={(e) => setFormData({ ...formData, joinPolicy: e.target.value })}
              >
                <option value="OPEN">{t.games.join_policy_open}</option>
                <option value="APPROVAL">{t.games.join_policy_approval}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t.games.time_label}</label>
            <input 
              type="datetime-local"
              className="w-full border rounded-md px-3 py-2"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">종료 시간</label>
            <input 
              type="datetime-local"
              className="w-full border rounded-md px-3 py-2"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t.games.place_label}</label>
            <input 
              className="w-full border rounded-md px-3 py-2"
              placeholder="예: 강남구 테니스장"
              value={formData.homeArea}
              onChange={(e) => setFormData({ ...formData, homeArea: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t.games.capacity_label}</label>
            <input 
              type="number"
              className="w-full border rounded-md px-3 py-2"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            {t.games.create_title}
          </button>
        </form>
      </div>
    </div>
  );
}
