'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { TRANSLATIONS } from '@norijjak/shared';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { User, Mail, Globe, ShieldCheck } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const t = TRANSLATIONS['ko-KR'];

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight">{t.app_name} Profile</h1>
          <p className="text-slate-500 font-medium mt-1 text-lg">Manage your account and preferences</p>
        </div>
        <Button variant="outline" onClick={logout} className="text-rose-600 hover:bg-rose-50 hover:text-rose-600 border-rose-100 rounded-xl font-bold">
          Logout
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="border-b border-slate-50 pb-6">
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Primary details for your NoriJjak account</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label className="text-slate-400">Display Name</Label>
                  <div className="flex items-center gap-2 font-bold text-slate-700">
                    <User className="h-4 w-4 text-primary" />
                    {user.displayName || 'Not set'}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-400">Email Address</Label>
                  <div className="flex items-center gap-2 font-bold text-slate-700">
                    <Mail className="h-4 w-4 text-primary" />
                    {user.email}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-400">Language</Label>
                  <div className="flex items-center gap-2 font-bold text-slate-700">
                    <Globe className="h-4 w-4 text-primary" />
                    {user.locale === 'ko-KR' ? '한국어 (Korea)' : 'English (US)'}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-400">Account Status</Label>
                  <div className="flex items-center gap-2 border border-emerald-100 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-black w-fit">
                    <ShieldCheck className="h-3 w-3" />
                    VERIFIED
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-indigo-900 border-none text-white overflow-hidden relative">
            <CardHeader>
              <CardTitle className="text-white">Pro Membership</CardTitle>
              <CardDescription className="text-indigo-200">Unlock advanced features and premium venues</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="rounded-xl w-full border-none shadow-lg">Upgrade Now</Button>
            </CardContent>
            <Sparkles className="absolute -bottom-8 -right-8 h-32 w-32 text-indigo-400/20 rotate-12" />
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10 space-y-4">
                <div className="w-20 h-20 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center mx-auto">
                  <Trophy className="h-10 w-10 text-slate-300" />
                </div>
                <p className="text-slate-400 text-sm font-medium">No badges earned yet.</p>
                <Button variant="outline" size="sm" className="rounded-lg">Browse Goals</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

