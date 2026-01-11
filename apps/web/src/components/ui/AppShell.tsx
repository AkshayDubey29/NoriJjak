import React from 'react';
import Link from 'next/link';
import { Home, Trophy, Users, MapPin, Bell, User, Search, MessageSquare } from 'lucide-react';
import { cn } from './Button';
import { TRANSLATIONS } from '@norijjak/shared';

const NAVIGATION = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Games', href: '/games', icon: Trophy },
  { name: 'Clubs', href: '/clubs', icon: Users },
  { name: 'Venues', href: '/venues', icon: MapPin },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Profile', href: '/profile', icon: User },
];

export const Sidebar = ({ className }: { className?: string }) => {
  const t = TRANSLATIONS['ko-KR']; // Default for now
  
  return (
    <div className={cn("flex flex-col h-full bg-white border-r border-slate-100 w-64 pt-8 pb-4 px-4 overflow-y-auto", className)}>
      <div className="flex items-center px-4 mb-10">
        <div className="bg-primary w-10 h-10 rounded-xl flex items-center justify-center mr-3 shadow-indigo-200 shadow-lg">
          <Trophy className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-600">
          {t.app_name}
        </span>
      </div>

      <nav className="flex-1 space-y-1">
        {NAVIGATION.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center px-4 py-3 text-sm font-medium rounded-xl text-slate-600 hover:bg-slate-50 hover:text-primary transition-all duration-200"
          >
            <item.icon className="mr-3 h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="mt-auto px-4 pt-4 border-t border-slate-50">
        <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all duration-200">
          <User className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export const Navbar = () => {
  return (
    <header className="h-16 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-8">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input 
            type="text" 
            placeholder="Search for games or clubs..." 
            className="w-full bg-slate-50 border-none rounded-xl h-10 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-xl border border-slate-100 relative hover:bg-slate-50 transition-colors">
          <MessageSquare className="h-5 w-5 text-slate-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
          <User className="h-6 w-6 text-slate-400" />
        </div>
      </div>
    </header>
  );
};
