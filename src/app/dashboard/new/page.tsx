'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils';
import { Loader2, Plus, Trash2, ArrowLeft, ChevronRight } from 'lucide-react';
import type { Milestone } from '@/lib/supabase/types';

const ACCENT_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444',
];

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<1 | 2>(1);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [headline, setHeadline] = useState('');
  const [subheadline, setSubheadline] = useState('');
  const [ctaText, setCtaText] = useState('Join the Waitlist');
  const [accentColor, setAccentColor] = useState('#6366f1');
  const [milestones, setMilestones] = useState<Milestone[]>([
    { count: 100, reward: 'Early access + 20% lifetime discount' },
    { count: 500, reward: 'Beta tester badge + free first month' },
  ]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slugEdited) setSlug(slugify(val));
  };

  const addMilestone = () => {
    setMilestones([...milestones, { count: 0, reward: '' }]);
  };

  const removeMilestone = (i: number) => {
    setMilestones(milestones.filter((_, idx) => idx !== i));
  };

  const updateMilestone = (i: number, field: keyof Milestone, value: string | number) => {
    const updated = [...milestones];
    updated[i] = { ...updated[i], [field]: field === 'count' ? Number(value) : value };
    setMilestones(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/auth/login'); return; }

    // Check plan limits
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single();

    if (profile?.plan === 'free') {
      const { count } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', user.id);

      if ((count ?? 0) >= 1) {
        setError('Free plan is limited to 1 project. Upgrade to Pro for unlimited waitlists.');
        setLoading(false);
        return;
      }
    }

    const validMilestones = milestones.filter(m => m.count > 0 && m.reward.trim());

    const { data: project, error: insertError } = await supabase
      .from('projects')
      .insert({
        owner_id: user.id,
        name: name.trim(),
        slug: slug.trim(),
        headline: headline.trim(),
        subheadline: subheadline.trim() || null,
        cta_text: ctaText.trim() || 'Join the Waitlist',
        accent_color: accentColor,
        milestones: validMilestones,
      })
      .select()
      .single();

    if (insertError) {
      if (insertError.code === '23505') {
        setError('That URL slug is already taken. Try a different one.');
      } else {
        setError(insertError.message);
      }
      setLoading(false);
      return;
    }

    router.push(`/dashboard/projects/${project.id}?created=true`);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard" className="text-gray-500 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-2xl font-bold">Create Waitlist</h1>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => step === 2 && s === 1 && setStep(1)}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                s === step
                  ? 'bg-brand-600 text-white'
                  : s < step
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-800 text-gray-500'
              }`}
            >
              {s}
            </button>
            <span className={`text-sm ${s === step ? 'text-white' : 'text-gray-500'}`}>
              {s === 1 ? 'Basic Info' : 'Milestones'}
            </span>
            {s < 2 && <ChevronRight size={14} className="text-gray-600 mx-1" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="glass rounded-2xl p-6 space-y-5 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Project name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className="w-full bg-gray-800 border border-gray-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors"
                placeholder="My Awesome App"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">URL slug *</label>
              <div className="flex items-center bg-gray-800 border border-gray-700 focus-within:border-brand-500 rounded-lg overflow-hidden">
                <span className="px-3 py-3 text-gray-500 text-sm border-r border-gray-700 bg-gray-800/50 whitespace-nowrap">
                  waitboost.com/w/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); }}
                  required
                  className="flex-1 bg-transparent px-3 py-3 text-sm text-white placeholder-gray-500 outline-none"
                  placeholder="my-awesome-app"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Headline *</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                required
                className="w-full bg-gray-800 border border-gray-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors"
                placeholder="The future of task management is here"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Subheadline</label>
              <textarea
                value={subheadline}
                onChange={(e) => setSubheadline(e.target.value)}
                rows={2}
                className="w-full bg-gray-800 border border-gray-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors resize-none"
                placeholder="Describe what makes your product special..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">CTA button text</label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors"
                placeholder="Join the Waitlist"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Accent color</label>
              <div className="flex items-center gap-3 flex-wrap">
                {ACCENT_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setAccentColor(c)}
                    className="w-8 h-8 rounded-full transition-transform hover:scale-110 border-2"
                    style={{
                      backgroundColor: c,
                      borderColor: accentColor === c ? 'white' : 'transparent',
                    }}
                  />
                ))}
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-8 h-8 rounded-full cursor-pointer bg-transparent border-0"
                  title="Custom color"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!name || !slug || !headline) {
                  setError('Please fill in project name, slug, and headline.');
                  return;
                }
                setError('');
                setStep(2);
              }}
              className="w-full bg-brand-600 hover:bg-brand-500 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Next: Milestones →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="glass rounded-2xl p-6 space-y-5 animate-fade-in">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-semibold">Reward Milestones</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Incentivize referrals with rewards at signup counts</p>
                </div>
                <button
                  type="button"
                  onClick={addMilestone}
                  className="flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-300 transition-colors"
                >
                  <Plus size={14} /> Add
                </button>
              </div>

              <div className="space-y-3">
                {milestones.map((m, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-28">
                      <label className="block text-xs text-gray-500 mb-1">Signups</label>
                      <input
                        type="number"
                        min={1}
                        value={m.count}
                        onChange={(e) => updateMilestone(i, 'count', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 focus:border-brand-500 rounded-lg px-3 py-2 text-sm text-white outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Reward description</label>
                      <input
                        type="text"
                        value={m.reward}
                        onChange={(e) => updateMilestone(i, 'reward', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 focus:border-brand-500 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none"
                        placeholder="Early access + 20% off"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMilestone(i)}
                      className="mt-5 p-2 text-gray-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {milestones.length === 0 && (
                <div className="text-center py-6 text-gray-500 text-sm border border-dashed border-gray-700 rounded-lg">
                  No milestones yet. Add one to incentivize referrals.
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 border border-gray-700 hover:border-gray-500 text-gray-300 font-medium py-3 rounded-lg transition-colors"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-brand-600 hover:bg-brand-500 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Creating…</> : '🚀 Launch Waitlist'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
