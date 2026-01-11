'use client';

import { useState, useEffect } from 'react';
import { TRANSLATIONS } from '@norijjak/shared';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Plus, Search, MapPin, Users, Globe, ChevronRight, Sparkles } from 'lucide-react';

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
    setLoading(true);
    const url = new URL('http://localhost:4000/clubs');
    if (search) url.searchParams.append('query', search);
    
    fetch(url.toString())
      .then(res => res.json())
      .then(data => {
        setClubs(data.clubs || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch clubs:', err);
        setClubs([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchClubs(query);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight">{t.clubs.list_title}</h1>
          <p className="text-slate-500 font-medium mt-1">Join specialized communities and play with regulars</p>
        </div>
        <Link href="/clubs/create">
          <Button size="lg" className="rounded-2xl shadow-lg shadow-indigo-100 group">
            <Plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" />
            {t.clubs.create_title}
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex gap-4 items-center bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input 
            type="text" 
            placeholder={t.clubs.search_placeholder}
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
        {loading && clubs.length === 0 ? (
          [1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-3xl h-64 animate-pulse border border-slate-100" />
          ))
        ) : (
          <>
            {clubs.map(club => (
              <Link key={club.id} href={`/clubs/${club.id}`} className="group">
                <Card className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-100/50 flex flex-col">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                        <Users className="h-8 w-8 text-slate-300 group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider">
                          {club.visibility}
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-1">
                      {club.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 font-medium">
                      <MapPin className="h-3 w-3" />
                      {club.homeArea}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto space-y-4 pt-0">
                    <div className="flex flex-wrap gap-2">
                      {club.sports.map(s => (
                        <span key={s.id} className="bg-slate-50 text-slate-600 text-[10px] font-black uppercase px-2 py-1 rounded-lg border border-slate-100">
                          {s.name_ko}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-1.5 text-slate-900 font-black text-sm">
                        <Users className="h-4 w-4 text-slate-400" />
                        {club._count.members}
                        <span className="text-slate-400 font-medium font-sans">Members</span>
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

      {clubs.length === 0 && !loading && (
        <div className="text-center py-20 space-y-4 bg-white rounded-3xl border border-dashed border-slate-200 col-span-full">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
            <Globe className="h-10 w-10 text-slate-300" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">No clubs found</h3>
            <p className="text-slate-500">Try a different search or be the first to create one!</p>
          </div>
          <Link href="/clubs/create">
            <Button variant="outline" className="rounded-xl">Create a Club</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

