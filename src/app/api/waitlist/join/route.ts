import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { generateReferralCode } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, projectId, referralCode } = body;

    if (!email || !projectId) {
      return NextResponse.json(
        { error: 'Email and project ID are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const supabase = await createServiceClient();

    // Verify project exists and is active
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, is_active')
      .eq('id', projectId)
      .eq('is_active', true)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check if already signed up
    const { data: existing } = await supabase
      .from('waitlist_entries')
      .select('id, referral_code, position')
      .eq('project_id', projectId)
      .eq('email', email.toLowerCase())
      .single();

    if (existing) {
      return NextResponse.json({
        success: true,
        alreadySignedUp: true,
        entry: existing,
      });
    }

    // Resolve referrer
    let referredById: string | null = null;
    if (referralCode) {
      const { data: referrer } = await supabase
        .from('waitlist_entries')
        .select('id')
        .eq('referral_code', referralCode)
        .eq('project_id', projectId)
        .single();

      if (referrer) {
        referredById = referrer.id;
      }
    }

    // Get next position
    const { data: posData } = await supabase.rpc('get_next_position', {
      p_project_id: projectId,
    });
    const position = posData ?? 1;

    // Generate unique referral code
    let newCode = generateReferralCode();
    let attempts = 0;
    while (attempts < 10) {
      const { data: codeCheck } = await supabase
        .from('waitlist_entries')
        .select('id')
        .eq('referral_code', newCode)
        .maybeSingle();
      if (!codeCheck) break;
      newCode = generateReferralCode();
      attempts++;
    }

    // Insert entry
    const { data: entry, error: insertError } = await supabase
      .from('waitlist_entries')
      .insert({
        project_id: projectId,
        email: email.toLowerCase(),
        name: name?.trim() || null,
        referral_code: newCode,
        referred_by_id: referredById,
        position,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({ error: 'Failed to join waitlist' }, { status: 500 });
    }

    // Increment referrer count
    if (referredById) {
      await supabase.rpc('increment_referral_count', { entry_id: referredById });
    }

    return NextResponse.json({ success: true, entry });
  } catch (err) {
    console.error('Waitlist join error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
