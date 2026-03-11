import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ArrowLeft, Download, Users, TrendingUp, Share2, Trophy } from 'lucide-react';
import { formatNumber, formatPercent, formatDate, ordinal } from '@/lib/utils';

export default async function AnalyticsPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', params.id)
    .eq('owner_id', user.id)
    .single();

  if (!project) notFound();

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();

  // Fetch all entries
  const { data: entries } = await supabase
    .from('waitlist_entries')
    .select('*')
    .eq('project_id', params.id)
    .order('referral_count', { ascending: false });

  const allEntries = entries ?? [];
  const totalSignups = allEntries.length;
  const referredSignups = allEntries.filter(e => e.referred_by_id !== null).length;
  const topReferrers = allEntries.filter(e => e.referral_count > 0).slice(0, 10);

  // Signups by day (last 30 days)
  const signupsByDay: Record<string, number> = {};
  const last30 = new Date();
  last30.setDate(last30.getDate() - 30);

  allEntries.forEach(e => {
    const day = e.created_at.split('T')[0];
    signupsByDay[day] = (signupsByDay[day] ?? 0) + 1;
  });

  const dailyData = Object.entries(signupsByDay)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-14);

  const maxDailyCount = Math.max(...dailyData.map(([, v]) => v), 1);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/projects/${params.id}`} className="text-gray-500 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{project.name} — Analytics</h1>
            <p className="text-gray-400 text-sm mt-0.5">waitboost.com/w/{project.slug}</p>
          </div>
        </div>

        {profile?.plan === 'pro' ? (
          <a
            href={`/api/waitlist/${params.id}/export`}
            download
            className="flex items-center gap-2 text-sm bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white px-4 py-2.5 rounded-lg transition-colors"
          >
            <Download size={14} />
            Export CSV
          </a>
        ) : (
          <div className="flex items-center gap-2 text-sm text-gray-500 border border-gray-700 px-4 py-2.5 rounded-lg cursor-not-allowed" title="Upgrade to Pro to export">
            <Download size={14} />
            Export CSV (Pro)
          </div>
        )}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
            <Users size={13} /> Total Signups
          </div>
          <p className="text-3xl font-bold">{formatNumber(totalSignups)}</p>
        </div>

        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
            <Share2 size={13} /> Referred
          </div>
          <p className="text-3xl font-bold text-brand-400">{formatNumber(referredSignups)}</p>
        </div>

        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
            <TrendingUp size={13} /> Referral Rate
          </div>
          <p className="text-3xl font-bold text-green-400">{formatPercent(referredSignups, totalSignups)}</p>
        </div>

        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
            <Trophy size={13} /> Avg. Refs / Signup
          </div>
          <p className="text-3xl font-bold">
            {totalSignups > 0
              ? (allEntries.reduce((s, e) => s + e.referral_count, 0) / totalSignups).toFixed(1)
              : '0'}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Daily signups chart */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Signups (last 14 days)</h2>
          {dailyData.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-gray-500 text-sm">No signups yet</div>
          ) : (
            <div className="flex items-end gap-1.5 h-40">
              {dailyData.map(([day, count]) => (
                <div key={day} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="relative w-full">
                    <div
                      className="w-full rounded-t-sm transition-all"
                      style={{
                        height: `${(count / maxDailyCount) * 120}px`,
                        backgroundColor: project.accent_color,
                        opacity: 0.8,
                        minHeight: '4px',
                      }}
                    />
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {count}
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 rotate-45 origin-left whitespace-nowrap" style={{ fontSize: '9px' }}>
                    {day.slice(5)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top referrers */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Trophy size={16} className="text-yellow-400" /> Top Referrers
          </h2>
          {topReferrers.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              No referrals yet. Share your waitlist to get started!
            </div>
          ) : (
            <div className="space-y-3">
              {topReferrers.map((entry, i) => (
                <div key={entry.id} className="flex items-center gap-3">
                  <span className="text-lg w-6 text-center">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 truncate">{entry.email}</p>
                    <p className="text-xs text-gray-500">Joined {formatDate(entry.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className="text-sm font-bold"
                      style={{ color: project.accent_color }}
                    >
                      {entry.referral_count}
                    </span>
                    <p className="text-xs text-gray-500">refs</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent signups table */}
      <div className="glass rounded-2xl p-6 mt-6">
        <h2 className="font-semibold mb-4">Recent Signups</h2>
        {allEntries.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">No signups yet. Share your waitlist!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left">
                  <th className="pb-3 text-xs font-medium text-gray-400 uppercase tracking-wider">#</th>
                  <th className="pb-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="pb-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Referral Code</th>
                  <th className="pb-3 text-xs font-medium text-gray-400 uppercase tracking-wider text-center">Refs</th>
                  <th className="pb-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Referred By</th>
                  <th className="pb-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {allEntries.slice(0, 50).map((entry) => {
                  const referrer = allEntries.find(e => e.id === entry.referred_by_id);
                  return (
                    <tr key={entry.id} className="hover:bg-white/2 transition-colors">
                      <td className="py-3 text-gray-500 font-mono">{entry.position}</td>
                      <td className="py-3 text-gray-300">{entry.email}</td>
                      <td className="py-3">
                        <code className="text-xs bg-gray-800 text-brand-300 px-2 py-0.5 rounded">
                          {entry.referral_code}
                        </code>
                      </td>
                      <td className="py-3 text-center">
                        <span
                          className={`font-semibold ${entry.referral_count > 0 ? 'text-brand-400' : 'text-gray-600'}`}
                        >
                          {entry.referral_count}
                        </span>
                      </td>
                      <td className="py-3 text-gray-500 text-xs">
                        {referrer ? referrer.email : '—'}
                      </td>
                      <td className="py-3 text-gray-500 text-xs">{formatDate(entry.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {allEntries.length > 50 && (
              <p className="text-center text-gray-500 text-xs mt-4">
                Showing 50 of {allEntries.length} signups. Export CSV for the full list.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
