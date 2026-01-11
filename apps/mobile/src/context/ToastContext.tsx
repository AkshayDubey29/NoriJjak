import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastType } from '../components/common/Toast';

interface ToastContextData {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ message: string; type: ToastType; duration?: number } | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration?: number) => {
    setToast({ message, type, duration });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          duration={toast.duration} 
          onHide={hideToast} 
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
