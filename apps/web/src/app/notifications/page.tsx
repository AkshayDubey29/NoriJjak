'use client';

import { useState, useEffect } from 'react';
import { TRANSLATIONS } from '@norijjak/shared';
import Link from 'next/link';

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
        setNotifications(data.notifications);
        setLoading(false);
      });
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

  const getMessage = (n: Notification) => {
    switch (n.type) {
      case 'GAME_REQUEST': return t.games.notification_game_request.replace('{{userName}}', n.payload.userName).replace('{{gameTitle}}', n.payload.gameTitle);
      case 'GAME_APPROVED': return t.games.notification_game_approved.replace('{{gameTitle}}', n.payload.gameTitle);
      case 'GAME_DENIED': return t.games.notification_game_denied.replace('{{gameTitle}}', n.payload.gameTitle);
      case 'GAME_CANCELLED': return t.games.notification_game_cancelled.replace('{{gameTitle}}', n.payload.gameTitle);
      case 'WAITLIST_PROMOTED': return t.games.notification_waitlist_promoted.replace('{{gameTitle}}', n.payload.gameTitle);
      default: return 'Unknown notification';
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t.games.notifications_title}</h1>
        
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          {notifications.map(n => (
            <div 
              key={n.id} 
              className={`p-6 border-b last:border-0 flex justify-between items-start transition-colors ${n.isRead ? 'opacity-60' : 'bg-blue-50/30'}`}
              onMouseEnter={() => !n.isRead && markRead(n.id)}
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900">{getMessage(n)}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(n.createdAt).toLocaleString('ko-KR')}</p>
                {n.payload.gameId && (
                  <Link href={`/games/${n.payload.gameId}`} className="text-blue-600 text-sm font-bold mt-2 inline-block">
                    경기 보기
                  </Link>
                )}
              </div>
              {!n.isRead && <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>}
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              {t.games.no_notifications}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

