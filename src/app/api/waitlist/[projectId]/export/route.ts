import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify ownership
  const { data: project } = await supabase
    .from('projects')
    .select('id, name, owner_id')
    .eq('id', params.projectId)
    .eq('owner_id', user.id)
    .single();

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  // Check pro plan
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();

  if (profile?.plan !== 'pro') {
    return NextResponse.json(
      { error: 'CSV export requires a Pro plan' },
      { status: 403 }
    );
  }

  // Fetch all entries
  const { data: entries, error } = await supabase
    .from('waitlist_entries')
    .select('*')
    .eq('project_id', params.projectId)
    .order('position', { ascending: true });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
  }

  // Build CSV
  const headers = ['position', 'email', 'name', 'referral_code', 'referral_count', 'referred_by_id', 'joined_at'];
  const rows = (entries ?? []).map(e => [
    e.position,
    e.email,
    e.name ?? '',
    e.referral_code,
    e.referral_count,
    e.referred_by_id ?? '',
    e.created_at,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  const filename = `${project.name.replace(/[^a-z0-9]/gi, '_')}_waitlist_${new Date().toISOString().split('T')[0]}.csv`;

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
