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
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-white/5 flex flex-col fixed inset-y-0 left-0 z-30">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
            <span>⚡</span>
            <span className="gradient-text">WaitBoost</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors group"
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/dashboard/new"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Plus size={16} />
            <span>New Waitlist</span>
          </Link>
        </nav>

        {/* Plan badge */}
        {profile?.plan === 'free' && (
          <div className="m-4">
            <div className="glass rounded-xl p-4 text-center">
              <Crown size={20} className="text-yellow-400 mx-auto mb-2" />
              <p className="text-xs text-gray-400 mb-3">Upgrade for unlimited projects & CSV export</p>
              <form action="/api/stripe/checkout/upgrade" method="POST">
                <button
                  type="submit"
                  className="w-full text-xs bg-brand-600 hover:bg-brand-500 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Upgrade to Pro
                </button>
              </form>
            </div>
          </div>
        )}

        {profile?.plan === 'pro' && (
          <div className="m-4">
            <div className="flex items-center gap-2 glass rounded-xl p-3 text-xs text-brand-300">
              <Crown size={14} className="text-yellow-400" />
              <span className="font-medium">Pro Plan</span>
            </div>
          </div>
        )}

        {/* User */}
        <div className="border-t border-white/5 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-xs font-bold text-white">
              {(profile?.full_name ?? profile?.email ?? 'U')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {profile?.full_name ?? 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
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
