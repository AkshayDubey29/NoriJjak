'use client';

import { useState, useEffect } from 'react';
import { TRANSLATIONS } from '@norijjak/shared';
import Link from 'next/link';

interface Venue {
  id: string;
  name: string;
  area: string;
  category: string;
  sports: { id: string; name_ko: string; name_en: string }[];
}

export default function VenuesListPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const t = TRANSLATIONS['ko-KR'];

  const fetchVenues = (search: string = '') => {
    const url = new URL('http://localhost:4000/venues');
    if (search) url.searchParams.append('query', search);
    
    fetch(url.toString())
      .then(res => res.json())
      .then(data => {
        setVenues(data.venues);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    fetchVenues(query);
  };

  if (loading && venues.length === 0) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t.venues.list_title}</h1>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input 
              type="text"
              placeholder={t.venues.search_placeholder}
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
          {venues.map(venue => (
            <Link 
              key={venue.id} 
              href={`/venues/${venue.id}`}
              className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow block"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase">{venue.category}</span>
                  <h2 className="text-xl font-bold mt-1">{venue.name}</h2>
                  <p className="text-gray-500 text-sm mt-2">{venue.area}</p>
                  <div className="flex gap-2 mt-3">
                    {venue.sports.map(s => (
                      <span key={s.id} className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded">
                        {s.name_ko}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {venues.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
              {t.venues.no_venues}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

