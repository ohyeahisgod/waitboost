import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import {
  Plus, ExternalLink, Settings, BarChart3,
  Users, TrendingUp, Trophy, FolderOpen,
  ArrowRight, UserPlus, GitBranch, Zap,
} from 'lucide-react';
import { formatNumber, formatPercent, formatDate } from '@/lib/utils';
import type { Project } from '@/lib/supabase/types';
import CopyButton from '@/components/CopyButton';

// ─── Types ────────────────────────────────────────────────
interface ProjectWithStats extends Project {
  total_signups: number;
  referred_signups: number;
}

interface ActivityEvent {
  id: string;
  email: string;
  project_name: string;
  project_slug: string;
  is_referral: boolean;
  created_at: string;
}

// ─── Data fetching ────────────────────────────────────────
async function getProjectsWithStats(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<ProjectWithStats[]> {
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });

  if (!projects?.length) return [];

  return Promise.all(
    projects.map(async (project: Project) => {
      const { count: total } = await supabase
        .from('waitlist_entries')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', project.id);

      const { count: referred } = await supabase
        .from('waitlist_entries')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', project.id)
        .not('referred_by_id', 'is', null);

      return { ...project, total_signups: total ?? 0, referred_signups: referred ?? 0 };
    })
  );
}

async function getTopReferrer(
  supabase: Awaited<ReturnType<typeof createClient>>,
  projectIds: string[]
): Promise<{ email: string; referral_count: number } | null> {
  if (!projectIds.length) return null;

  const { data } = await supabase
    .from('waitlist_entries')
    .select('email, referral_count')
    .in('project_id', projectIds)
    .gt('referral_count', 0)
    .order('referral_count', { ascending: false })
    .limit(1)
    .maybeSingle();

  return data ?? null;
}

async function getRecentActivity(
  supabase: Awaited<ReturnType<typeof createClient>>,
  projects: ProjectWithStats[]
): Promise<ActivityEvent[]> {
  if (!projects.length) return [];

  const projectMap = new Map(projects.map(p => [p.id, { name: p.name, slug: p.slug }]));
  const projectIds = projects.map(p => p.id);

  const { data } = await supabase
    .from('waitlist_entries')
    .select('id, email, project_id, referred_by_id, created_at')
    .in('project_id', projectIds)
    .order('created_at', { ascending: false })
    .limit(8);

  if (!data) return [];

  return data.map(entry => ({
    id: entry.id,
    email: entry.email,
    project_name: projectMap.get(entry.project_id)?.name ?? 'Unknown',
    project_slug: projectMap.get(entry.project_id)?.slug ?? '',
    is_referral: entry.referred_by_id !== null,
    created_at: entry.created_at,
  }));
}

// ─── Helpers ──────────────────────────────────────────────
function maskEmail(email: string) {
  const [user, domain] = email.split('@');
  if (!user || !domain) return email;
  const visible = user.slice(0, 2);
  return `${visible}${'•'.repeat(Math.max(2, user.length - 2))}@${domain}`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ─── Page ─────────────────────────────────────────────────
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { upgraded?: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, plan')
    .eq('id', user.id)
    .single();

  const projects = await getProjectsWithStats(supabase, user.id);
  const projectIds = projects.map(p => p.id);

  const [topReferrer, recentActivity] = await Promise.all([
    getTopReferrer(supabase, projectIds),
    getRecentActivity(supabase, projects),
  ]);

  // Aggregate metrics
  const totalSignups  = projects.reduce((s, p) => s + p.total_signups, 0);
  const totalReferred = projects.reduce((s, p) => s + p.referred_signups, 0);
  const referralRate  = totalSignups > 0 ? Math.round((totalReferred / totalSignups) * 100) : 0;

  const firstName = profile?.full_name?.split(' ')[0] ?? null;
  const firstProject = projects[0] ?? null;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://waitboost.vercel.app';

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-[1100px] mx-auto px-8 py-10 space-y-8">

        {/* ── Upgrade banner ── */}
        {searchParams.upgraded === 'true' && (
          <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
              <Zap size={18} className="text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-green-900 text-sm">You&apos;re on Pro!</p>
              <p className="text-sm text-green-700 mt-0.5">Unlimited projects, CSV export, and custom branding are now unlocked.</p>
            </div>
          </div>
        )}

        {/* ── 1. Greeting ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Welcome back{firstName ? `, ${firstName}` : ''}
            </h1>
            <p className="text-slate-500 text-sm mt-1">Let&apos;s grow your waitlists.</p>
          </div>
          <Link
            href="/dashboard/new"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-indigo-200 shrink-0"
          >
            <Plus size={16} />
            Create Waitlist
          </Link>
        </div>

        {/* ── 2. Key Metrics ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Projects */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Projects</p>
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <FolderOpen size={14} className="text-slate-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 leading-none">{formatNumber(projects.length)}</p>
            <p className="text-xs text-slate-400 mt-2">{projects.filter(p => p.is_active).length} live</p>
          </div>

          {/* Total Signups */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Signups</p>
              <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                <Users size={14} className="text-indigo-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 leading-none">{formatNumber(totalSignups)}</p>
            <p className="text-xs text-slate-400 mt-2">across all waitlists</p>
          </div>

          {/* Referral Rate */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Referral Rate</p>
              <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center">
                <TrendingUp size={14} className="text-violet-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 leading-none">{referralRate}%</p>
            <p className="text-xs text-slate-400 mt-2">{formatNumber(totalReferred)} referred signups</p>
          </div>

          {/* Top Referrer */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Top Referrer</p>
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                <Trophy size={14} className="text-amber-500" />
              </div>
            </div>
            {topReferrer ? (
              <>
                <p className="text-sm font-semibold text-slate-900 leading-snug truncate">{maskEmail(topReferrer.email)}</p>
                <p className="text-xs text-slate-400 mt-2">{topReferrer.referral_count} referrals</p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-slate-400 leading-snug">No referrals yet</p>
                <p className="text-xs text-slate-300 mt-2">Share your waitlist to start</p>
              </>
            )}
          </div>
        </div>

        {/* ── 3. Quick Actions ── */}
        <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-1 divide-x divide-slate-100">
            <div className="pr-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Quick Actions</p>
            </div>

            <Link
              href="/dashboard/new"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-all"
            >
              <Plus size={15} className="text-slate-400" />
              Create Waitlist
            </Link>

            {firstProject && (
              <CopyButton
                text={`${appUrl}/w/${firstProject.slug}`}
                label="Copy Referral Link"
                className="px-4 py-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 transition-all"
              />
            )}

            {firstProject && (
              <Link
                href={`/dashboard/projects/${firstProject.id}/analytics`}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-all"
              >
                <BarChart3 size={15} className="text-slate-400" />
                View Analytics
              </Link>
            )}
          </div>
        </div>

        {/* ── 4 + 5. Projects + Activity (2-col) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── 4. Waitlist Projects ── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Your Waitlists</h2>
              {projects.length > 0 && (
                <Link href="/dashboard/new" className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1">
                  New <ArrowRight size={12} />
                </Link>
              )}
            </div>

            {projects.length === 0 ? (
              /* Empty state */
              <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-12 text-center shadow-sm">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap size={24} className="text-indigo-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-1">Create your first waitlist</h3>
                <p className="text-sm text-slate-400 mb-5 max-w-xs mx-auto leading-relaxed">
                  Set up a referral-powered waitlist in minutes and start collecting signups.
                </p>
                <Link
                  href="/dashboard/new"
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                >
                  <Plus size={15} />
                  Create Waitlist
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all group"
                  >
                    {/* Top row: avatar + name + status + actions */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Color avatar */}
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm"
                          style={{ backgroundColor: project.accent_color }}
                        >
                          {project.name[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-slate-900 text-sm">{project.name}</h3>
                            {/* Status badge */}
                            <span className={[
                              'inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full',
                              project.is_active
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-slate-100 text-slate-500 border border-slate-200',
                            ].join(' ')}>
                              {project.is_active && (
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                              )}
                              {project.is_active ? 'Live' : 'Paused'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 truncate">
                            Created {formatDate(project.created_at)} · /w/{project.slug}
                          </p>
                        </div>
                      </div>

                      {/* Action icons */}
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <Link href={`/w/${project.slug}`} target="_blank"
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Open public page">
                          <ExternalLink size={14} />
                        </Link>
                        <Link href={`/dashboard/projects/${project.id}/analytics`}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Analytics">
                          <BarChart3 size={14} />
                        </Link>
                        <Link href={`/dashboard/projects/${project.id}`}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Settings">
                          <Settings size={14} />
                        </Link>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                      <div>
                        <p className="text-xl font-bold text-slate-900 leading-none">{formatNumber(project.total_signups)}</p>
                        <p className="text-xs text-slate-400 mt-1">Signups</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-slate-900 leading-none">{formatNumber(project.referred_signups)}</p>
                        <p className="text-xs text-slate-400 mt-1">Referred</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-indigo-600 leading-none">
                          {formatPercent(project.referred_signups, project.total_signups)}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Rate</p>
                      </div>
                    </div>

                    {/* CTA row */}
                    <div className="flex items-center gap-3 pt-4 mt-1 border-t border-slate-100">
                      <Link href={`/w/${project.slug}`} target="_blank"
                        className="flex-1 text-center text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 py-2 rounded-lg transition-all">
                        Open
                      </Link>
                      <Link href={`/dashboard/projects/${project.id}/analytics`}
                        className="flex-1 text-center text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 py-2 rounded-lg transition-all">
                        Analytics
                      </Link>
                      <Link href={`/dashboard/projects/${project.id}`}
                        className="flex-1 text-center text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 py-2 rounded-lg transition-all">
                        Settings
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── 5. Recent Activity ── */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-900">Recent Activity</h2>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              {recentActivity.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Users size={16} className="text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-500 font-medium">No activity yet</p>
                  <p className="text-xs text-slate-400 mt-1">Signups will appear here</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {recentActivity.map((event) => (
                    <li key={event.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                      {/* Icon */}
                      <div className={[
                        'w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                        event.is_referral
                          ? 'bg-violet-50'
                          : 'bg-indigo-50',
                      ].join(' ')}>
                        {event.is_referral
                          ? <GitBranch size={12} className="text-violet-500" />
                          : <UserPlus size={12} className="text-indigo-500" />}
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-700 truncate">
                          {maskEmail(event.email)}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                          {event.is_referral ? 'Joined via referral · ' : 'Joined · '}
                          <span className="font-medium text-slate-500">{event.project_name}</span>
                        </p>
                      </div>

                      {/* Time */}
                      <p className="text-[10px] text-slate-400 shrink-0 mt-0.5">{timeAgo(event.created_at)}</p>
                    </li>
                  ))}
                </ul>
              )}

              {recentActivity.length > 0 && (
                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50">
                  <p className="text-xs text-slate-400 text-center">
                    Showing {recentActivity.length} most recent events
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
