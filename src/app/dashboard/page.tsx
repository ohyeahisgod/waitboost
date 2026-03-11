import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Plus, ExternalLink, Settings, Users, TrendingUp, BarChart3 } from 'lucide-react';
import { formatNumber, formatPercent, formatDate } from '@/lib/utils';
import type { Project } from '@/lib/supabase/types';

async function getProjectsWithStats(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });

  if (!projects?.length) return [];

  const projectsWithStats = await Promise.all(
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

      return {
        ...project,
        total_signups: total ?? 0,
        referred_signups: referred ?? 0,
      };
    })
  );

  return projectsWithStats;
}

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

  const totalSignups = projects.reduce((s: number, p: { total_signups: number }) => s + p.total_signups, 0);
  const totalReferred = projects.reduce((s: number, p: { referred_signups: number }) => s + p.referred_signups, 0);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}! 👋
          </h1>
          <p className="text-gray-400 mt-1">Here&apos;s how your waitlists are performing.</p>
        </div>
        <Link
          href="/dashboard/new"
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shine"
        >
          <Plus size={16} />
          New Waitlist
        </Link>
      </div>

      {/* Upgrade success banner */}
      {searchParams.upgraded === 'true' && (
        <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-semibold text-green-300">You&apos;re on Pro!</p>
            <p className="text-sm text-green-400/70">Unlimited projects, CSV export, and custom branding unlocked.</p>
          </div>
        </div>
      )}

      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass rounded-xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Total Projects</p>
          <p className="text-3xl font-bold">{formatNumber(projects.length)}</p>
        </div>
        <div className="glass rounded-xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Total Signups</p>
          <p className="text-3xl font-bold">{formatNumber(totalSignups)}</p>
        </div>
        <div className="glass rounded-xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Referred Signups</p>
          <p className="text-3xl font-bold text-brand-400">
            {formatNumber(totalReferred)}
            <span className="text-base font-normal text-gray-500 ml-2">
              {formatPercent(totalReferred, totalSignups)}
            </span>
          </p>
        </div>
      </div>

      {/* Projects list */}
      {projects.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-xl font-semibold mb-2">Create your first waitlist</h2>
          <p className="text-gray-400 mb-6 max-w-sm mx-auto text-sm">
            Set up a referral-powered waitlist in minutes. Get your first signups today.
          </p>
          <Link
            href="/dashboard/new"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Plus size={16} />
            Create waitlist
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your Waitlists</h2>
          {projects.map((project) => (
            <div
              key={project.id}
              className="glass rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-brand-500/20 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: project.accent_color }}
                >
                  {project.name[0].toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{project.name}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        project.is_active
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-gray-500/10 text-gray-400'
                      }`}
                    >
                      {project.is_active ? 'Live' : 'Paused'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Created {formatDate(project.created_at)} · waitboost.com/w/{project.slug}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-lg font-bold">{formatNumber(project.total_signups)}</p>
                  <p className="text-xs text-gray-500">Signups</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-brand-400">
                    {formatPercent(project.referred_signups, project.total_signups)}
                  </p>
                  <p className="text-xs text-gray-500">Referred</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/w/${project.slug}`}
                    target="_blank"
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    title="View public page"
                  >
                    <ExternalLink size={15} />
                  </Link>
                  <Link
                    href={`/dashboard/projects/${project.id}/analytics`}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    title="Analytics"
                  >
                    <BarChart3 size={15} />
                  </Link>
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    title="Settings"
                  >
                    <Settings size={15} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
