'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { User, Mail, Star, Trophy, ShieldCheck, MapPin, Settings, Share2 } from 'lucide-react';

interface Reputation {
  average: number;
  count: number;
  badges: string[];
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [reputation, setReputation] = useState<Reputation | null>(null);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:4000/ratings/summary/user/${user.id}`)
        .then(res => res.json())
        .then(data => setReputation(data));
    }
  }, [user]);

  if (!user) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
        <User className="h-8 w-8 text-slate-300" />
      </div>
      <p className="text-slate-500 font-medium">Please login to view your profile</p>
      <Button variant="outline">Sign In</Button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 md:p-12 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-500 to-primary flex items-center justify-center text-5xl font-black shadow-xl border-4 border-white/10">
              {user.displayName?.[0] || 'U'}
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-emerald-500 border-4 border-slate-900 flex items-center justify-center shadow-lg">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-4xl font-black tracking-tight">{user.displayName || 'Anonymous Player'}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <Mail className="h-4 w-4" />
                {user.email}
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                Seoul, Korea
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="secondary" size="sm" className="rounded-xl border-none font-bold">
                <Settings className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
              <Button variant="outline" size="sm" className="bg-transparent border-white/20 text-white hover:bg-white/10 rounded-xl font-bold">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 bg-primary/20 w-64 h-64 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 -ml-12 -mb-12 bg-indigo-500/20 w-80 h-80 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-50/50 via-white to-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  Reputation Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-slate-900">{reputation?.average || 0}</span>
                  <span className="text-slate-400 font-bold">/ 5.0</span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-2">Based on {reputation?.count || 0} verified ratings</p>
                <div className="w-full h-2 bg-slate-50 rounded-full mt-4 overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 transition-all duration-1000"
                    style={{ width: `${((reputation?.average || 0) / 5) * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-indigo-500" />
                  Total Matches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-black text-slate-900">12</div>
                <p className="text-xs text-slate-500 font-medium mt-2">8 Wins • 4 Losses</p>
                <div className="flex gap-1 mt-4">
                  {[1, 1, 1, 0, 1].map((w, i) => (
                    <div key={i} className={cn("h-1.5 flex-1 rounded-full", w ? "bg-emerald-500" : "bg-rose-500")} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Achievements & Badges</CardTitle>
              <CardDescription>Earn recognition for your sportsmanship and skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {reputation && reputation.badges.length > 0 ? (
                  reputation.badges.map(badge => (
                    <div key={badge} className="px-4 py-2 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3 group hover:border-amber-200 hover:bg-amber-50 transition-all">
                      <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                        🏆
                      </div>
                      <span className="text-sm font-bold text-slate-700">{badge}</span>
                    </div>
                  ))
                ) : (
                  <div className="w-full py-12 text-center border-2 border-dashed border-slate-50 rounded-3xl">
                    <p className="text-slate-400 font-medium italic">No badges earned yet. Join a match to start your journey!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Reliability</span>
                  <span className="font-black">98%</span>
                </div>
                <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[98%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Sportsmanship</span>
                  <span className="font-black">4.9</span>
                </div>
                <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[90%]" />
                </div>
              </div>
              <div className="pt-4 border-t border-slate-50">
                <Label className="text-slate-400 text-[10px] uppercase font-black tracking-widest">Favorite Sports</Label>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-wider">Football</span>
                  <span className="px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-wider">Basketball</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

