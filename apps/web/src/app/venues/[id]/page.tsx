'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { TRANSLATIONS } from '@norijjak/shared';

interface VenueDetail {
  id: string;
  name: string;
  area: string;
  address: string | null;
  category: string;
  amenities: string[] | null;
  contact: string | null;
  mapLink: string | null;
  sports: { id: string; name_ko: string }[];
  _count: { games: number };
}

export default function VenueDetailPage() {
  const { id } = useParams();
  const [venue, setVenue] = useState<VenueDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const t = TRANSLATIONS['ko-KR'];

  useEffect(() => {
    fetch(`http://localhost:4000/venues/${id}`)
      .then(res => res.json())
      .then(data => {
        setVenue(data.venue);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!venue) return <div className="p-8 text-center">Venue not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gray-800 p-8 text-white">
          <span className="text-sm font-bold uppercase opacity-60">{venue.category}</span>
          <h1 className="text-4xl font-bold mt-2">{venue.name}</h1>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase mb-1">{t.venues.address_label}</h3>
              <p className="font-semibold">{venue.address || venue.area}</p>
              {venue.mapLink && (
                <a href={venue.mapLink} target="_blank" className="text-blue-600 text-sm font-bold mt-1 inline-block">지도 보기</a>
              )}
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase mb-1">{t.venues.contact_label}</h3>
              <p className="font-semibold">{venue.contact || 'N/A'}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">{t.venues.amenities_label}</h3>
            <div className="flex flex-wrap gap-2">
              {venue.amenities?.map(a => (
                <span key={a} className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">{a}</span>
              )) || 'N/A'}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Supported Sports</h3>
            <div className="flex flex-wrap gap-2">
              {venue.sports.map(s => (
                <span key={s.id} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-bold">
                  {s.name_ko}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t">
            <div className="bg-blue-50 p-6 rounded-xl flex justify-between items-center">
              <div>
                <h4 className="text-blue-900 font-bold">{t.venues.open_games}</h4>
                <p className="text-blue-700 text-sm mt-1">{venue._count.games}개의 경기가 진행 중입니다.</p>
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">경기 보기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

