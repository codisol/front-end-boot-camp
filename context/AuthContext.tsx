'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, DEFAULT_ADMIN, DEFAULT_USER } from '@/lib/seedData';
import { getCurrentUser, setCurrentUser, getStorageItem } from '@/lib/store';
import { isValidEmail } from '@/lib/validation';

interface AuthContextType {
  user: UserAccount | null;
  isAdmin: boolean;
  login: (username: string, password?: string) => { success: boolean; error?: string; role?: 'user' | 'admin' };
  register: (email: string, username: string, password?: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const active = getCurrentUser();
    setUser(active);
    setIsLoaded(true);
  }, []);

  const login = (username: string, password?: string): { success: boolean; error?: string; role?: 'user' | 'admin' } => {
    const trimmedUsername = username.trim().toLowerCase();
    
    if (!trimmedUsername) {
      return { success: false, error: 'Username field must be filled in.' };
    }

    if (password !== undefined && password.trim() === '') {
      return { success: false, error: 'Password field must be filled in.' };
    }

    // Check admin dummy account
    if (trimmedUsername === 'admin' || trimmedUsername === 'admin@movieapp.com') {
      const adminAcc: UserAccount = DEFAULT_ADMIN;
      setUser(adminAcc);
      setCurrentUser(adminAcc);
      return { success: true, role: 'admin' };
    }

    // Check stored users or default user
    if (trimmedUsername === DEFAULT_USER.username.toLowerCase() || trimmedUsername === DEFAULT_USER.email.toLowerCase()) {
      setUser(DEFAULT_USER);
      setCurrentUser(DEFAULT_USER);
      return { success: true, role: 'user' };
    }

    // Check custom registered users from localStorage
    const savedUsers: UserAccount[] = typeof window !== 'undefined' 
      ? JSON.parse(localStorage.getItem('movie_app_registered_users') || '[]') 
      : [];
    
    const foundUser = savedUsers.find(
      (u) => u.username.toLowerCase() === trimmedUsername || u.email.toLowerCase() === trimmedUsername
    );

    if (foundUser) {
      setUser(foundUser);
      setCurrentUser(foundUser);
      return { success: true, role: foundUser.role };
    }

    return { success: false, error: 'User account is not registered. Please register first.' };
  };

  const register = (email: string, username: string, password?: string) => {
    if (!email.trim()) {
      return { success: false, error: 'The email field must be filled in.' };
    }
    if (!isValidEmail(email)) {
      return { success: false, error: 'The email field must be in a valid email format.' };
    }
    if (!username.trim()) {
      return { success: false, error: 'The username field must be filled in.' };
    }
    if (password !== undefined && !password.trim()) {
      return { success: false, error: 'The password field must be filled in.' };
    }

    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      email: email.trim(),
      username: username.trim(),
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    // Save user to registered users
    if (typeof window !== 'undefined') {
      const savedUsers: UserAccount[] = JSON.parse(localStorage.getItem('movie_app_registered_users') || '[]');
      savedUsers.push(newUser);
      localStorage.setItem('movie_app_registered_users', JSON.stringify(savedUsers));
    }

    // Auto log in after registration
    setUser(newUser);
    setCurrentUser(newUser);

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
