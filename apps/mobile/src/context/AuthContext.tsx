import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  displayName?: string;
  locale: string;
  onboardingStep?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setInternalUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuth = async () => {
      const savedUser = await AsyncStorage.getItem('@user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };
    loadAuth();
  }, []);

  const login = async (token: string, user: User) => {
    await AsyncStorage.setItem('@token', token);
    await AsyncStorage.setItem('@user', JSON.stringify(user));
    setInternalUser(user);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('@token');
    await AsyncStorage.removeItem('@user');
    setInternalUser(null);
  };

  const setUser = async (user: User | null) => {
    if (user) {
      await AsyncStorage.setItem('@user', JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem('@user');
    }
    setInternalUser(user);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

