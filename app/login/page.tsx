'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('The username field must be filled in.');
      return;
    }

    if (!password.trim()) {
      setError('The password field must be filled in.');
      return;
    }

    setIsSubmitting(true);

    const res = login(username, password);

    if (!res.success) {
      setError(res.error || 'Login failed.');
      setIsSubmitting(false);
      return;
    }

    // Redirect based on role
    if (res.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/movies');
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 glass-modal rounded-3xl border border-slate-800 shadow-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 items-center justify-center text-2xl mb-3 border border-amber-500/30">
          🔑
        </div>
        <h1 className="text-2xl font-black text-slate-100">Welcome Back</h1>
        <p className="text-xs text-slate-400 mt-1">Login to access your movie collection</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. john_doe or admin"
            className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
        >
          {isSubmitting ? 'Logging in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-400">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-bold text-amber-400 hover:underline ml-1">
          Register here
        </Link>
      </div>

      <div className="mt-4 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 text-[11px] text-slate-400">
        <p className="font-semibold text-slate-300 mb-1">💡 Demo Accounts:</p>
        <p>• Admin: <code className="text-amber-300">admin</code></p>
        <p>• User: <code className="text-amber-300">john_doe</code></p>
      </div>
    </div>
  );
}
