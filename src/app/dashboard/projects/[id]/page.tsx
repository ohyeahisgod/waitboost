'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils';
import { Loader2, Plus, Trash2, ArrowLeft, Save, ExternalLink, CheckCircle2, Copy, BarChart3 } from 'lucide-react';
import type { Project, Milestone } from '@/lib/supabase/types';

const ACCENT_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

export default function ProjectSettingsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const justCreated = searchParams.get('created') === 'true';

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [headline, setHeadline] = useState('');
  const [subheadline, setSubheadline] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [accentColor, setAccentColor] = useState('#6366f1');
  const [isActive, setIsActive] = useState(true);
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    const loadProject = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (!data) { router.push('/dashboard'); return; }

      setProject(data);
      setName(data.name);
      setSlug(data.slug);
      setHeadline(data.headline);
      setSubheadline(data.subheadline ?? '');
      setCtaText(data.cta_text);
      setAccentColor(data.accent_color);
      setIsActive(data.is_active);
      setMilestones(data.milestones ?? []);
      setLoading(false);
    };
    loadProject();
  }, [id, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);

    const supabase = createClient();
    const validMilestones = milestones.filter(m => m.count > 0 && m.reward.trim());

    const { error: updateError } = await supabase
      .from('projects')
      .update({
        name: name.trim(),
        slug: slug.trim(),
        headline: headline.trim(),
        subheadline: subheadline.trim() || null,
        cta_text: ctaText.trim() || 'Join the Waitlist',
        accent_color: accentColor,
        is_active: isActive,
        milestones: validMilestones,
      })
      .eq('id', id);

    if (updateError) {
      if (updateError.code === '23505') {
        setError('That URL slug is already taken.');
      } else {
        setError(updateError.message);
      }
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }

    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this waitlist? This cannot be undone.')) return;

    const supabase = createClient();
    await supabase.from('projects').delete().eq('id', id);
    router.push('/dashboard');
  };

  const copyLink = () => {
    const url = `${window.location.origin}/w/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-brand-400" size={28} />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Link href="/dashboard" className="text-gray-500 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-2xl font-bold">{project?.name}</h1>
        <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-500'}`}>
          {isActive ? 'Live' : 'Paused'}
        </span>
      </div>

      {/* Quick links */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href={`/w/${slug}`}
          target="_blank"
          className="flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-300 transition-colors"
        >
          <ExternalLink size={13} /> View public page
        </Link>
        <span className="text-gray-700">·</span>
        <Link
          href={`/dashboard/projects/${id}/analytics`}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <BarChart3 size={13} /> Analytics
        </Link>
        <span className="text-gray-700">·</span>
        <button onClick={copyLink} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
          {copied ? <CheckCircle2 size={13} className="text-green-400" /> : <Copy size={13} />}
          {copied ? 'Copied!' : 'Copy link'}
        </button>
      </div>

      {justCreated && (
        <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-semibold text-green-300">Your waitlist is live!</p>
            <p className="text-sm text-green-400/70">
              Share <span className="font-mono">/w/{slug}</span> to start collecting signups.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic settings */}
        <div className="glass rounded-2xl p-6 space-y-5">
          <h2 className="font-semibold text-lg">Page Settings</h2>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Project name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full bg-gray-800 border border-gray-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">URL slug</label>
            <div className="flex items-center bg-gray-800 border border-gray-700 focus-within:border-brand-500 rounded-lg overflow-hidden">
              <span className="px-3 py-3 text-gray-500 text-sm border-r border-gray-700 bg-gray-800/50 whitespace-nowrap">waitboost.com/w/</span>
              <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required
                className="flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Headline</label>
            <input type="text" value={headline} onChange={(e) => setHeadline(e.target.value)} required
              className="w-full bg-gray-800 border border-gray-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Subheadline</label>
            <textarea value={subheadline} onChange={(e) => setSubheadline(e.target.value)} rows={2}
              className="w-full bg-gray-800 border border-gray-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">CTA button text</label>
            <input type="text" value={ctaText} onChange={(e) => setCtaText(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Accent color</label>
            <div className="flex items-center gap-3 flex-wrap">
              {ACCENT_COLORS.map((c) => (
                <button key={c} type="button" onClick={() => setAccentColor(c)}
                  className="w-8 h-8 rounded-full transition-transform hover:scale-110 border-2"
                  style={{ backgroundColor: c, borderColor: accentColor === c ? 'white' : 'transparent' }} />
              ))}
              <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)}
                className="w-8 h-8 rounded-full cursor-pointer bg-transparent border-0" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div>
              <p className="text-sm font-medium">Status</p>
              <p className="text-xs text-gray-500">Toggle whether signups are open</p>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isActive ? 'bg-brand-600' : 'bg-gray-700'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Milestones */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold">Reward Milestones</h2>
              <p className="text-xs text-gray-400 mt-0.5">Displayed as progress goals on the waitlist page</p>
            </div>
            <button type="button" onClick={() => setMilestones([...milestones, { count: 0, reward: '' }])}
              className="flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-300 transition-colors">
              <Plus size={14} /> Add
            </button>
          </div>

          <div className="space-y-3">
            {milestones.map((m, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-28">
                  <label className="block text-xs text-gray-500 mb-1">Signups</label>
                  <input type="number" min={1} value={m.count}
                    onChange={(e) => { const u = [...milestones]; u[i] = { ...u[i], count: Number(e.target.value) }; setMilestones(u); }}
                    className="w-full bg-gray-800 border border-gray-700 focus:border-brand-500 rounded-lg px-3 py-2 text-sm text-white outline-none" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">Reward</label>
                  <input type="text" value={m.reward}
                    onChange={(e) => { const u = [...milestones]; u[i] = { ...u[i], reward: e.target.value }; setMilestones(u); }}
                    className="w-full bg-gray-800 border border-gray-700 focus:border-brand-500 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none"
                    placeholder="Early access + 20% off" />
                </div>
                <button type="button" onClick={() => setMilestones(milestones.filter((_, idx) => idx !== i))}
                  className="mt-5 p-2 text-gray-600 hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">{error}</div>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="flex-1 bg-brand-600 hover:bg-brand-500 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
            {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> :
             saved ? <><CheckCircle2 size={16} className="text-green-400" /> Saved!</> :
             <><Save size={16} /> Save Changes</>}
          </button>
          <button type="button" onClick={handleDelete}
            className="px-4 py-3 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg text-sm font-medium transition-colors">
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}
