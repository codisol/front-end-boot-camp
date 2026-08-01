'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { isValidEmail } from '@/lib/validation';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('The email field must be filled in.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('The email field must use a valid email format.');
      return;
    }

    if (!username.trim()) {
      setError('The username field must be filled in.');
      return;
    }

    if (!password.trim()) {
      setError('The password field must be filled in.');
      return;
    }

    if (password !== confirmPassword) {
      setError('The confirm password value must match the password value.');
      return;
    }

    setIsSubmitting(true);

    const res = register(email, username, password);

    if (!res.success) {
      setError(res.error || 'Registration failed.');
      setIsSubmitting(false);
      return;
    }

    // Auto logged in -> Redirect to User Dashboard
    router.push('/movies');
  };

  return (
    <div className="max-w-md mx-auto my-8 p-8 glass-modal rounded-3xl border border-slate-800 shadow-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 items-center justify-center text-2xl mb-3 border border-amber-500/30">
          ✨
        </div>
        <h1 className="text-2xl font-black text-slate-100">Create Account</h1>
        <p className="text-xs text-slate-400 mt-1">Start collecting your favorite movies today</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="movie_fanatic"
            className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
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

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
        >
          {isSubmitting ? 'Registering...' : 'Register Account'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-400">
        Already registered?{' '}
        <Link href="/login" className="font-bold text-amber-400 hover:underline ml-1">
          Back to Login
        </Link>
      </div>
    </div>
  );
}
