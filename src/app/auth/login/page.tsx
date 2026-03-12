'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? '/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push(redirectTo);
    router.refresh();
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback?next=${redirectTo}` },
    });
    if (error) { setError(error.message); setGoogleLoading(false); }
  };

  return (
    <div className="space-y-5">
      <button type="button" onClick={handleGoogleLogin} disabled={googleLoading || loading}
        className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-60 disabled:cursor-not-allowed text-slate-700 font-semibold py-3 rounded-xl transition-all shadow-sm text-sm">
        {googleLoading ? <Loader2 size={18} className="animate-spin" /> : <GoogleIcon />}
        Continue with Google
      </button>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-slate-400 text-xs">or sign in with email</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email"
            className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
            placeholder="you@startup.com" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <a href="#" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">Forgot password?</a>
          </div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password"
            className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
            placeholder="••••••••" />
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
        )}
        <button type="submit" disabled={loading || googleLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm shadow-indigo-200">
          {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[560px] flex-col bg-slate-900 p-12 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-violet-600/15 blur-3xl" />
        </div>
        <div className="relative">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl text-white">
            <span>⚡</span>
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">WaitBoost</span>
          </Link>
        </div>
        <div className="relative flex-1 flex flex-col justify-center">
          <p className="text-3xl font-bold text-white leading-snug mb-4">
            Turn your waitlist into a<br />
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">viral growth engine</span>
          </p>
          <p className="text-slate-400 text-base leading-relaxed mb-10">
            Referral leaderboards, milestone rewards, and real-time analytics — everything you need to launch with momentum.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '12,400+', label: 'Waitlist signups collected' },
              { value: '38%',     label: 'Average referral rate' },
              { value: '3 min',   label: 'Average setup time' },
              { value: '100%',    label: 'Free to start' },
            ].map(s => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-xl font-bold text-white mb-0.5">{s.value}</p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <p className="text-slate-600 text-xs">© 2025 WaitBoost. All rights reserved.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="lg:hidden mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl">
            <span>⚡</span>
            <span className="gradient-text">WaitBoost</span>
          </Link>
        </div>
        <div className="w-full max-w-[400px]">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
            <p className="text-slate-500 text-sm mt-1">Sign in to your WaitBoost account</p>
          </div>
          <Suspense fallback={
            <div className="space-y-4 animate-pulse">
              <div className="h-12 bg-slate-100 rounded-xl" />
              <div className="h-px bg-slate-200" />
              <div className="h-12 bg-slate-100 rounded-xl" />
              <div className="h-12 bg-slate-100 rounded-xl" />
              <div className="h-12 bg-indigo-100 rounded-xl" />
            </div>
          }>
            <LoginForm />
          </Suspense>
          <p className="text-center text-slate-500 text-sm mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-indigo-600 hover:text-indigo-700 font-semibold">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
