'use client';

import { useState } from 'react';
import { TRANSLATIONS, Locale } from '@norijjak/shared';
import { Share2, Globe } from 'lucide-react';

export default function Home() {
  const [locale, setLocale] = useState<Locale>('ko-KR');
  const t = TRANSLATIONS[locale];

  const toggleLocale = () => {
    setLocale((prev) => (prev === 'ko-KR' ? 'en-US' : 'ko-KR'));
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex justify-between items-center p-6 border-b">
        <h1 className="text-2xl font-bold text-blue-600">{t.app_name}</h1>
        <button
          onClick={toggleLocale}
          className="flex items-center gap-2 px-4 py-2 border rounded-full hover:bg-gray-50 transition-colors"
        >
          <Globe size={18} />
          <span>{t.labels.language}: {locale === 'ko-KR' ? '한국어' : 'English'}</span>
        </button>
      </header>

      {/* Hero / Navigation */}
      <nav className="flex justify-center gap-8 py-8 border-b bg-gray-50">
        <a href="#" className="font-semibold text-gray-700 hover:text-blue-600">{t.nav.home}</a>
        <a href="#" className="font-semibold text-gray-700 hover:text-blue-600">{t.nav.explore}</a>
        <a href="#" className="font-semibold text-gray-700 hover:text-blue-600">{t.nav.profile}</a>
      </nav>

      {/* Main Sections */}
      <div className="max-w-4xl mx-auto py-12 px-6 space-y-12">
        <section className="p-8 bg-blue-50 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">{t.landing.find_games}</h2>
          <p className="text-gray-600">Discover local games and join players near you.</p>
        </section>

        <section className="p-8 bg-green-50 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">{t.landing.book_venues}</h2>
          <p className="text-gray-600">Reserve courts and fields with just a few taps.</p>
        </section>

        <section className="p-8 bg-purple-50 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">{t.landing.achievements}</h2>
          <p className="text-gray-600">Track your progress and earn badges.</p>
        </section>

        <div className="flex justify-center pt-8">
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
            <Share2 size={20} />
            {t.labels.share}
          </button>
        </div>
      </div>
    </main>
  );
}

