'use client';

import { useState, useEffect } from 'react';
import { TRANSLATIONS } from '@norijjak/shared';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { GameCardSkeleton } from '@/components/ui/Skeleton';
import { Plus, Search, Filter, Calendar, MapPin, Users, ChevronRight, Trophy } from 'lucide-react';

interface Game {
  id: string;
  title: string;
  startTime: string;
  homeArea: string;
  sport: {
    name_ko: string;
  };
  _count: {
    participants: number;
  };
  capacity: number;
}

export default function GamesListPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const t = TRANSLATIONS['ko-KR'];

  const fetchGames = (currentCursor: string | null = null, isInitial = false) => {
    if (isInitial) setLoading(true);
    const url = new URL('http://localhost:4000/games');
    if (currentCursor) url.searchParams.append('cursor', currentCursor);
    url.searchParams.append('limit', '10');

    fetch(url.toString())
      .then(res => res.json())
      .then(data => {
        if (currentCursor) {
          setGames(prev => [...prev, ...data.games]);
        } else {
          setGames(data.games);
        }
        setCursor(data.nextCursor);
        setHasMore(!!data.nextCursor);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchGames(null, true);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight">{t.games.list_title}</h1>
          <p className="text-slate-500 font-medium mt-1">Discover and join competitive or casual matches</p>
        </div>
        <Link href="/games/create">
          <Button size="lg" className="rounded-2xl shadow-lg shadow-indigo-100 group">
            <Plus className="mr-2 h-5 w-5" />
            {t.games.create_title}
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input 
            type="text" 
            placeholder="Search by title, area or sport..." 
            className="w-full bg-transparent border-none focus:ring-0 pl-12 pr-4 h-12 text-sm font-medium"
          />
        </div>
        <div className="h-8 w-px bg-slate-100 hidden md:block" />
        <Button variant="ghost" className="rounded-xl text-slate-600 font-bold hover:bg-slate-50 shrink-0">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="grid gap-6">
        {loading && games.length === 0 ? (
          <>
            <GameCardSkeleton />
            <GameCardSkeleton />
            <GameCardSkeleton />
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {games.map(game => (
                <Link key={game.id} href={`/games/${game.id}`} className="group">
                  <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-100/50">
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-primary text-[10px] font-black uppercase tracking-wider mb-2">
                          <Trophy className="h-3 w-3" />
                          {game.sport.name_ko}
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-1">
                          {game.title}
                        </CardTitle>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1.5 text-slate-900 font-black text-lg">
                          <Users className="h-4 w-4 text-slate-400" />
                          {game._count.participants}
                          <span className="text-slate-300 font-medium text-sm">/ {game.capacity}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-50 rounded-full mt-2 overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-500" 
                            style={{ width: `${(game._count.participants / game.capacity) * 100}%` }}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-y-3 gap-x-6 text-sm font-medium text-slate-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          {new Date(game.startTime).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          {game.homeArea}
                        </div>
                      </div>
                      <div className="pt-4 flex items-center justify-between border-t border-slate-50">
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">
                              U{i}
                            </div>
                          ))}
                        </div>
                        <Button variant="ghost" size="sm" className="text-primary font-black group-hover:bg-primary group-hover:text-white rounded-xl transition-all">
                          Join Match
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {games.length === 0 && (
              <div className="text-center py-20 space-y-4 bg-white rounded-3xl border border-dashed border-slate-200">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                  <Search className="h-10 w-10 text-slate-300" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">No matches found</h3>
                  <p className="text-slate-500">Try adjusting your filters or search terms.</p>
                </div>
                <Button variant="outline" className="rounded-xl">Clear all filters</Button>
              </div>
            )}

            {hasMore && (
              <div className="text-center pt-8">
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => fetchGames(cursor)}
                  className="rounded-2xl px-12 font-bold border-slate-200 hover:bg-slate-50"
                  isLoading={loading}
                >
                  Load More Matches
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
