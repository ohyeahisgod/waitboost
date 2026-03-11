import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';
import WaitlistClient from './WaitlistClient';
import type { WaitlistEntry } from '@/lib/supabase/types';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const supabase = await createClient();
  const { data: project } = await supabase
    .from('projects')
    .select('headline, subheadline, name')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single();

  if (!project) return { title: 'Waitlist' };

  return {
    title: project.name,
    description: project.subheadline ?? project.headline,
    openGraph: {
      title: project.name,
      description: project.subheadline ?? project.headline,
      type: 'website',
    },
  };
}

export default async function WaitlistPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { ref?: string };
}) {
  const supabase = await createClient();

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single();

  if (!project) notFound();

  // Fetch top referrers for leaderboard
  const { data: leaderboard } = await supabase
    .from('waitlist_entries')
    .select('id, email, name, referral_count, position')
    .eq('project_id', project.id)
    .gt('referral_count', 0)
    .order('referral_count', { ascending: false })
    .limit(10);

  // Total count
  const { count: totalSignups } = await supabase
    .from('waitlist_entries')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', project.id);

  return (
    <WaitlistClient
      project={project}
      leaderboard={(leaderboard ?? []) as WaitlistEntry[]}
      totalSignups={totalSignups ?? 0}
      referralCode={searchParams.ref}
    />
  );
}
