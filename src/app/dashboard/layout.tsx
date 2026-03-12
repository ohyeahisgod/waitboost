import { redirect } from 'next/navigation';
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

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 left-0 z-30">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
            <span>⚡</span>
            <span className="gradient-text">WaitBoost</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <LayoutDashboard size={16} className="text-slate-400" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/dashboard/new"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <Plus size={16} className="text-slate-400" />
            <span>New Waitlist</span>
          </Link>
        </nav>

        {/* Plan badge */}
        {profile?.plan === 'free' && (
          <div className="mx-3 mb-3">
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-center">
              <Crown size={18} className="text-amber-500 mx-auto mb-2" />
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                Upgrade for unlimited projects &amp; CSV export
              </p>
              <form action="/api/stripe/checkout/upgrade" method="POST">
                <button
                  type="submit"
                  className="w-full text-xs btn-primary py-2 px-3"
                >
                  Upgrade to Pro
                </button>
              </form>
            </div>
          </div>
        )}

        {profile?.plan === 'pro' && (
          <div className="mx-3 mb-3">
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700">
              <Crown size={14} className="text-amber-500 shrink-0" />
              <span className="font-medium">Pro Plan</span>
            </div>
          </div>
        )}

        {/* User */}
        <div className="border-t border-slate-200 p-3">
          <div className="flex items-center gap-3 mb-2 px-2 py-1.5">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {(profile?.full_name ?? profile?.email ?? 'U')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {profile?.full_name ?? 'User'}
              </p>
              <p className="text-xs text-slate-400 truncate">{profile?.email}</p>
            </div>
          </div>
          <DashboardSignOut />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
