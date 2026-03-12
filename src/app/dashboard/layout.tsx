import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { LayoutDashboard, Plus, Crown } from 'lucide-react';
import DashboardSignOut from '@/components/DashboardSignOut';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, plan')
    .eq('id', user.id)
    .single();

  const initials = (profile?.full_name ?? profile?.email ?? 'U')[0].toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* ── Sidebar ── */}
      <aside className="w-60 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 left-0 z-30 shadow-[1px_0_0_0_rgb(226_232_240)]">

        {/* Logo */}
        <div className="h-14 flex items-center px-5 border-b border-slate-200">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="WaitBoost" width={24} height={29} priority />
            <span className="font-bold text-slate-900 text-[15px] tracking-tight">WaitBoost</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 pt-2 pb-1">Main</p>
          <Link href="/dashboard"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors group">
            <LayoutDashboard size={15} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
            <span>Dashboard</span>
          </Link>
          <Link href="/dashboard/new"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors group">
            <Plus size={15} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
            <span>New Waitlist</span>
          </Link>
        </nav>

        {/* Upgrade CTA for free plan */}
        {profile?.plan === 'free' && (
          <div className="px-3 pb-3">
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown size={14} className="text-amber-500" />
                <span className="text-xs font-semibold text-slate-700">Upgrade to Pro</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                Unlimited projects, CSV export &amp; custom branding.
              </p>
              <form action="/api/stripe/checkout/upgrade" method="POST">
                <button type="submit"
                  className="w-full text-xs bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition-colors">
                  Upgrade — from $9/mo
                </button>
              </form>
            </div>
          </div>
        )}

        {profile?.plan === 'pro' && (
          <div className="px-3 pb-3">
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
              <Crown size={13} className="text-amber-500 shrink-0" />
              <span className="text-xs font-semibold text-amber-700">Pro Plan Active</span>
            </div>
          </div>
        )}

        {/* User footer */}
        <div className="border-t border-slate-200 p-3">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg mb-1">
            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-slate-800 truncate leading-tight">
                {profile?.full_name ?? 'User'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">{profile?.email}</p>
            </div>
          </div>
          <DashboardSignOut />
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 ml-60 min-h-screen">
        {children}
      </main>
    </div>
  );
}
