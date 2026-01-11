'use client';

import { useState, useEffect } from 'react';
import { TRANSLATIONS } from '@norijjak/shared';
import Link from 'next/link';

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

  const fetchGames = (currentCursor: string | null = null) => {
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
      });
  };

  useEffect(() => {
    fetchGames();
  }, []);

  if (loading && games.length === 0) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{t.games.list_title}</h1>
          <Link 
            href="/games/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-bold hover:bg-blue-700"
          >
            {t.games.create_title}
          </Link>
        </div>

        <div className="grid gap-4">
          {games.map(game => (
            <Link 
              key={game.id} 
              href={`/games/${game.id}`}
              className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow block"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-sm font-bold text-blue-600 uppercase">{game.sport.name_ko}</span>
                  <h2 className="text-xl font-bold mt-1">{game.title}</h2>
                  <p className="text-gray-500 text-sm mt-2">
                    {new Date(game.startTime).toLocaleString('ko-KR')} • {game.homeArea}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold">
                    {game._count.participants} / {game.capacity}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">참가자</p>
                </div>
              </div>
            </Link>
          ))}
          {games.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
              등록된 경기가 없습니다.
            </div>
          )}
        </div>

        {hasMore && (
          <div className="mt-8 text-center">
            <button 
              onClick={() => fetchGames(cursor)}
              className="bg-white border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-50 font-medium"
            >
              더 보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
