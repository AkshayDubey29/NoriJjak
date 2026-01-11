import React, { createContext, useContext, useState, useCallback } from 'react';
import { cn } from './Button';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'px-6 py-3 rounded-2xl shadow-lg border text-sm font-medium animate-in fade-in slide-in-from-right-4 duration-300',
              t.type === 'success' && 'bg-emerald-50 border-emerald-100 text-emerald-800',
              t.type === 'error' && 'bg-rose-50 border-rose-100 text-rose-800',
              t.type === 'info' && 'bg-blue-50 border-blue-100 text-blue-800',
              t.type === 'warning' && 'bg-amber-50 border-amber-100 text-amber-800'
            )}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
