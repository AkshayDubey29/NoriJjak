'use client';

import { useState, useEffect } from 'react';
import { TRANSLATIONS } from '@norijjak/shared';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Bell, BellOff, ChevronRight, Mail, Calendar, UserCheck, ShieldAlert, Zap } from 'lucide-react';
import { cn } from '@/components/ui/Button';

interface Notification {
  id: string;
  type: string;
  payload: {
    gameId?: string;
    gameTitle?: string;
    userName?: string;
    userId?: string;
  };
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const t = TRANSLATIONS['ko-KR'];

  const fetchNotifications = () => {
    fetch('http://localhost:4000/notifications', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        setNotifications(data.notifications || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markRead = async (id: string) => {
    await fetch(`http://localhost:4000/notifications/${id}/read`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const getNotificationDetails = (n: Notification) => {
    switch (n.type) {
      case 'GAME_REQUEST': 
        return {
          icon: UserCheck,
          color: 'text-amber-600',
          bg: 'bg-amber-50',
          message: t.games.notification_game_request.replace('{{userName}}', n.payload.userName).replace('{{gameTitle}}', n.payload.gameTitle)
        };
      case 'GAME_APPROVED': 
        return {
          icon: Zap,
          color: 'text-emerald-600',
          bg: 'bg-emerald-50',
          message: t.games.notification_game_approved.replace('{{gameTitle}}', n.payload.gameTitle)
        };
      case 'GAME_DENIED': 
        return {
          icon: ShieldAlert,
          color: 'text-rose-600',
          bg: 'bg-rose-50',
          message: t.games.notification_game_denied.replace('{{gameTitle}}', n.payload.gameTitle)
        };
      case 'GAME_CANCELLED': 
        return {
          icon: BellOff,
          color: 'text-slate-600',
          bg: 'bg-slate-50',
          message: t.games.notification_game_cancelled.replace('{{gameTitle}}', n.payload.gameTitle)
        };
      case 'WAITLIST_PROMOTED': 
        return {
          icon: Sparkles,
          color: 'text-indigo-600',
          bg: 'bg-indigo-50',
          message: t.games.notification_waitlist_promoted.replace('{{gameTitle}}', n.payload.gameTitle)
        };
      default: 
        return {
          icon: Bell,
          color: 'text-primary',
          bg: 'bg-primary/5',
          message: 'New activity on your account'
        };
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight">{t.games.notifications_title}</h1>
          <p className="text-slate-500 font-medium mt-1">Stay updated with your latest matches and requests</p>
        </div>
        <Button variant="ghost" size="sm" className="text-primary font-bold rounded-xl">Mark all as read</Button>
      </div>

      <Card className="overflow-hidden border-slate-100">
        <CardContent className="p-0">
          {loading && notifications.length === 0 ? (
            [1, 2, 3].map(i => (
              <div key={i} className="p-6 border-b border-slate-50 flex gap-4 animate-pulse">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-50 rounded w-3/4" />
                  <div className="h-3 bg-slate-50 rounded w-1/4" />
                </div>
              </div>
            ))
          ) : (
            <>
              {notifications.map(n => {
                const details = getNotificationDetails(n);
                return (
                  <div 
                    key={n.id} 
                    className={cn(
                      "p-6 border-b border-slate-50 last:border-0 flex gap-4 transition-all hover:bg-slate-50 group cursor-pointer",
                      !n.isRead && "bg-indigo-50/30"
                    )}
                    onClick={() => !n.isRead && markRead(n.id)}
                  >
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-white", details.bg)}>
                      <details.icon className={cn("h-6 w-6", details.color)} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start gap-4">
                        <p className={cn("text-sm font-bold leading-relaxed", n.isRead ? "text-slate-600" : "text-slate-900")}>
                          {details.message}
                        </p>
                        {!n.isRead && <div className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0" />}
                      </div>
                      <div className="flex items-center gap-3 pt-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                        {n.payload.gameId && (
                          <Link 
                            href={`/games/${n.payload.gameId}`} 
                            className="text-xs font-black text-primary hover:underline flex items-center gap-0.5"
                          >
                            View Match
                            <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {notifications.length === 0 && !loading && (
                <div className="p-20 text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto opacity-50">
                    <BellOff className="h-10 w-10 text-slate-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{t.games.no_notifications}</h3>
                    <p className="text-slate-500">You're all caught up! Come back later for updates.</p>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const Sparkles = ({ className }: { className?: string }) => (
  <Zap className={className} />
);

