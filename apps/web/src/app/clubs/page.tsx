'use client';

import { useState, useEffect } from 'react';
import { TRANSLATIONS } from '@norijjak/shared';
import Link from 'next/link';

interface Club {
  id: string;
  name: string;
  homeArea: string;
  visibility: string;
  sports: { id: string; name_ko: string }[];
  _count: { members: number };
}

export default function ClubsListPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const t = TRANSLATIONS['ko-KR'];

  const fetchClubs = (search: string = '') => {
    const url = new URL('http://localhost:4000/clubs');
    if (search) url.searchParams.append('query', search);
    
    fetch(url.toString())
      .then(res => res.json())
      .then(data => {
        setClubs(data.clubs);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    fetchClubs(query);
  };

  if (loading && clubs.length === 0) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{t.clubs.list_title}</h1>
          <Link 
            href="/clubs/create"
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-bold"
          >
            {t.clubs.create_title}
          </Link>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input 
              type="text"
              placeholder={t.clubs.search_placeholder}
              className="flex-1 border rounded-md px-4 py-2"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md font-bold">
              검색
            </button>
          </div>
        </form>

        <div className="grid gap-4">
          {clubs.map(club => (
            <Link 
              key={club.id} 
              href={`/clubs/${club.id}`}
              className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow block"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">{club.name}</h2>
                  <p className="text-gray-500 text-sm mt-1">{club.homeArea}</p>
                  <div className="flex gap-2 mt-3">
                    {club.sports.map(s => (
                      <span key={s.id} className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded">
                        {s.name_ko}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-blue-600 font-bold">{club._count.members} Members</span>
                  {club.visibility === 'PRIVATE' && (
                    <div className="text-xs text-gray-400 mt-1 uppercase font-bold">Private</div>
                  )}
                </div>
              </div>
            </Link>
          ))}
          {clubs.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
              {t.clubs.no_clubs}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

