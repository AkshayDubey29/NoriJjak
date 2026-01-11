'use client';
import React from 'react';
import { Navbar, Sidebar } from './AppShell';
import { ToastProvider } from './Toast';

export default function RootLayoutContent({ children }: { children: React.ReactNode }) {
  // Check if we are on an auth page
  const [isAuthPage, setIsAuthPage] = React.useState(false);

  React.useEffect(() => {
    setIsAuthPage(window.location.pathname.startsWith('/login') || window.location.pathname.startsWith('/signup'));
  }, []);

  if (isAuthPage) {
    return (
      <ToastProvider>
        <main className="min-h-screen bg-slate-50">
          {children}
        </main>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
        <Sidebar className="hidden md:flex" />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
