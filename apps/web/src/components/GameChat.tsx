'use client';

import { useState, useEffect, useRef } from 'react';
import { TRANSLATIONS } from '@norijjak/shared';
import { useAuth } from '@/context/AuthContext';

interface Message {
  id: string;
  body: string;
  senderId: string;
  sender: { id: string; displayName: string | null };
  createdAt: string;
}

export default function GameChat({ gameId }: { gameId: string }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS['ko-KR'];

  const fetchMessages = () => {
    fetch(`http://localhost:4000/games/${gameId}/chat`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Not eligible');
        return res.json();
      })
      .then(data => {
        setMessages(data.messages);
        setLoading(false);
      })
      .catch(() => {
        setError(t.chat.not_eligible);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [gameId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const res = await fetch(`http://localhost:4000/games/${gameId}/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ body: input })
      });
      if (res.ok) {
        setInput('');
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBlock = async (senderId: string) => {
    if (!confirm(t.safety.block_confirm)) return;
    try {
      await fetch(`http://localhost:4000/safety/block/${senderId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-4 text-center">Chat loading...</div>;
  if (error) return <div className="p-4 text-red-500 bg-red-50 rounded-lg">{error}</div>;

  return (
    <div className="flex flex-col h-[500px] bg-white border rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4 border-b bg-gray-50 font-bold flex justify-between items-center">
        <span>{t.chat.title}</span>
        <span className="text-xs text-gray-400 font-normal">Realtime via Polling (5s)</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-8">{t.chat.no_messages}</div>
        )}
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.senderId === user?.id ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-gray-500">{msg.sender.displayName || 'Anonymous'}</span>
              {msg.senderId !== user?.id && (
                <button 
                  onClick={() => handleBlock(msg.senderId)}
                  className="text-[10px] text-gray-300 hover:text-red-400"
                >
                  {t.chat.block_user}
                </button>
              )}
            </div>
            <div 
              className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                msg.senderId === user?.id 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-gray-100 text-gray-800 rounded-tl-none'
              }`}
            >
              {msg.body}
            </div>
            <span className="text-[10px] text-gray-400 mt-1">
              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t flex gap-2">
        <input 
          type="text"
          className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={t.chat.placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button 
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-blue-700 transition-colors"
        >
          {t.chat.send}
        </button>
      </form>
    </div>
  );
}

