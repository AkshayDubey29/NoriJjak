'use client';

import { useState, useEffect } from 'react';
import { TRANSLATIONS } from '@norijjak/shared';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Search, MapPin, Trophy, Star, ChevronRight, Navigation } from 'lucide-react';

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
    setLoading(true);
    const url = new URL('http://localhost:4000/venues');
    if (search) url.searchParams.append('query', search);
    
    fetch(url.toString())
      .then(res => res.json())
      .then(data => {
        setVenues(data.venues || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch venues:', err);
        setVenues([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVenues(query);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight">{t.venues.list_title}</h1>
          <p className="text-slate-500 font-medium mt-1">Book the best courts and fields in your local area</p>
        </div>
        <Button variant="outline" size="lg" className="rounded-2xl border-slate-200 font-bold">
          <MapPin className="mr-2 h-5 w-5" />
          Map View
        </Button>
      </div>

      <form onSubmit={handleSearch} className="flex gap-4 items-center bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input 
            type="text" 
            placeholder={t.venues.search_placeholder}
            className="w-full bg-transparent border-none focus:ring-0 pl-12 pr-4 h-12 text-sm font-medium"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button type="submit" className="rounded-xl px-6 font-bold shadow-md">
          Search
        </Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && venues.length === 0 ? (
          [1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-3xl h-80 animate-pulse border border-slate-100" />
          ))
        ) : (
          <>
            {venues.map(venue => (
              <Link key={venue.id} href={`/venues/${venue.id}`} className="group">
                <Card className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-100/50 flex flex-col overflow-hidden">
                  <div className="aspect-video bg-slate-100 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur shadow-sm text-slate-900 text-[10px] font-black uppercase tracking-wider">
                      {venue.category}
                    </div>
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 backdrop-blur shadow-sm flex items-center justify-center">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    </div>
                  </div>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-1">
                      {venue.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 font-medium">
                      <MapPin className="h-3 w-3" />
                      {venue.area}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto space-y-4 pt-0">
                    <div className="flex flex-wrap gap-2">
                      {venue.sports.map(s => (
                        <span key={s.id} className="bg-slate-50 text-slate-600 text-[10px] font-black uppercase px-2 py-1 rounded-lg border border-slate-100">
                          {s.name_ko}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-1.5 text-slate-900 font-black text-sm">
                        <Navigation className="h-4 w-4 text-primary" />
                        <span className="text-slate-400 font-medium font-sans">Bookings available</span>
                      </div>
                      <span className="text-primary group-hover:translate-x-1 transition-transform">
                        <ChevronRight className="h-5 w-5" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </>
        )}
      </div>

      {venues.length === 0 && !loading && (
        <div className="text-center py-20 space-y-4 bg-white rounded-3xl border border-dashed border-slate-200 col-span-full">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
            <Trophy className="h-10 w-10 text-slate-300" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">No venues found</h3>
            <p className="text-slate-500">Try a different area or category.</p>
          </div>
          <Button variant="outline" className="rounded-xl" onClick={() => fetchVenues('')}>Clear all</Button>
        </div>
      )}
    </div>
  );
}

