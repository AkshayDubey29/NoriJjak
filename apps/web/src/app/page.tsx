'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { TRANSLATIONS } from '@norijjak/shared';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Trophy, Users, MapPin, ArrowRight, Zap, Shield, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { user } = useAuth();
  const t = TRANSLATIONS['ko-KR'];

  if (user) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <section className="relative overflow-hidden rounded-3xl bg-primary p-8 md:p-12 text-white shadow-2xl shadow-indigo-200">
          <div className="relative z-10 max-w-2xl space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Welcome back, {user.displayName || 'Player'}!
            </h2>
            <p className="text-indigo-100 text-lg md:text-xl font-medium max-w-md">
              Your next game is just a few taps away. Ready to hit the field?
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button variant="secondary" size="lg" className="rounded-2xl group">
                Find a Game
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="bg-transparent border-white/20 text-white hover:bg-white/10 rounded-2xl">
                Create Game
              </Button>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-16 -mt-16 bg-white/10 w-64 h-64 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 mr-12 -mb-12 bg-indigo-400/20 w-80 h-80 rounded-full blur-3xl" />
          <Trophy className="absolute right-12 bottom-12 h-48 w-48 text-white/5 -rotate-12 hidden lg:block" />
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mb-2 shadow-sm border border-amber-100">
                <Trophy className="h-6 w-6 text-amber-600" />
              </div>
              <CardTitle className="text-xl">Your Games</CardTitle>
              <CardDescription>Keep track of your upcoming and past matches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 space-y-3">
                <div className="bg-slate-50 rounded-2xl p-6 border border-dashed border-slate-200">
                  <p className="text-sm text-slate-500 font-medium">No games found</p>
                  <Button variant="ghost" size="sm" className="mt-2 text-primary font-bold">Start Browsing</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-2 shadow-sm border border-indigo-100">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <CardTitle className="text-xl">Top Clubs</CardTitle>
              <CardDescription>Discover local communities near you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100" />
                      <div>
                        <p className="text-sm font-bold">Premium Club {i}</p>
                        <p className="text-xs text-slate-500">12 members</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-lg">View</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-2 shadow-sm border border-emerald-100">
                <MapPin className="h-6 w-6 text-emerald-600" />
              </div>
              <CardTitle className="text-xl">Popular Venues</CardTitle>
              <CardDescription>Best locations for your matches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100" />
                      <div>
                        <p className="text-sm font-bold">Sports Arena {i}</p>
                        <p className="text-xs text-slate-500">2.4km away</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-lg">Book</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-12 py-20 px-4 text-center">
      <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-top-8 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-primary text-sm font-bold shadow-sm">
          <Sparkles className="h-4 w-4" />
          The most premium sports platform in Korea
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 leading-tight">
          Find Your Perfect <br />
          <span className="text-primary italic">Sports Partner.</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
          NoriJjak brings together players, clubs, and venues in one elegant, seamless experience. Elevate your game today.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
        <Link href="/signup">
          <Button size="xl" className="rounded-2xl group shadow-xl shadow-indigo-200 px-10">
            Get Started for Free
            <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
        <Link href="/login">
          <Button variant="outline" size="xl" className="rounded-2xl px-10">
            Sign In
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto pt-20 animate-in fade-in duration-1000 delay-500">
        {[
          { icon: Zap, title: 'Lightning Fast', desc: 'Book venues and join games in seconds with our optimized flow.' },
          { icon: Shield, title: 'Verified Only', desc: 'Secure community with verified players and professional venues.' },
          { icon: Users, title: 'True Community', desc: 'Join clubs that match your skill level and passion for sports.' },
        ].map((feat, i) => (
          <div key={i} className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4 text-left hover:shadow-md transition-shadow group">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:bg-opacity-10 transition-colors">
              <feat.icon className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">{feat.title}</h3>
            <p className="text-slate-600 leading-relaxed font-medium">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

