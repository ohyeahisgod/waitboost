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
        <Loader2 className="animate-spin text-indigo-500" size={28} />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Link href="/dashboard" className="text-slate-400 hover:text-slate-700 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">{project?.name}</h1>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isActive ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
          {isActive ? 'Live' : 'Paused'}
        </span>
      </div>

      {/* Quick links */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href={`/w/${slug}`}
          target="_blank"
          className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          <ExternalLink size={13} /> View public page
        </Link>
        <span className="text-slate-300">·</span>
        <Link
          href={`/dashboard/projects/${id}/analytics`}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <BarChart3 size={13} /> Analytics
        </Link>
        <span className="text-slate-300">·</span>
        <button onClick={copyLink} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors">
          {copied ? <CheckCircle2 size={13} className="text-green-600" /> : <Copy size={13} />}
          {copied ? 'Copied!' : 'Copy link'}
        </button>
      </div>

      {justCreated && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-semibold text-green-800">Your waitlist is live!</p>
            <p className="text-sm text-green-700">
              Share <span className="font-mono">/w/{slug}</span> to start collecting signups.
            </p>
          </div>
        </div>
      )}

      {/* Invalid slug warning */}
      {project && /[:/\\]/.test(project.slug) && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-amber-800">⚠️ Your waitlist URL is broken</p>
          <p className="text-xs text-amber-700 mt-1">
            The slug <span className="font-mono bg-amber-100 px-1 rounded">{project.slug}</span> contains invalid characters (like <code>/</code> or <code>:</code>). This is why &ldquo;Open&rdquo; doesn&apos;t work.
          </p>
          <button
            type="button"
            onClick={() => setSlug(slugify(project.name))}
            className="mt-2 text-xs font-semibold text-amber-800 underline underline-offset-2"
          >
            Fix it → use &ldquo;{slugify(project.name)}&rdquo;
          </button>
          <span className="text-xs text-amber-600 ml-2">(then click Save Changes below)</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic settings */}
        <div className="card p-6 space-y-5">
          <h2 className="font-semibold text-slate-900 text-base">Page Settings</h2>

          <div>
            <label className="label">Project name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className="input" />
          </div>

          <div>
            <label className="label">URL slug</label>
            <div className="flex items-center bg-white border border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 rounded-lg overflow-hidden transition-all">
              <span className="px-3 py-3 text-slate-400 text-sm border-r border-slate-200 bg-slate-50 whitespace-nowrap">waitboost.com/w/</span>
              <input type="text" value={slug} onChange={(e) => setSlug(slugify(e.target.value))} required
                className="flex-1 bg-transparent px-3 py-3 text-sm text-slate-900 outline-none"
                placeholder="my-waitlist" />
            </div>
          </div>

          <div>
            <label className="label">Headline</label>
            <input type="text" value={headline} onChange={(e) => setHeadline(e.target.value)} required
              className="input" />
          </div>

          <div>
            <label className="label">Subheadline</label>
            <textarea value={subheadline} onChange={(e) => setSubheadline(e.target.value)} rows={2}
              className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 rounded-lg px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors resize-none" />
          </div>

          <div>
            <label className="label">CTA button text</label>
            <input type="text" value={ctaText} onChange={(e) => setCtaText(e.target.value)}
              className="input" />
          </div>

          <div>
            <label className="label">Accent color</label>
            <div className="flex items-center gap-3 flex-wrap mt-1">
              {ACCENT_COLORS.map((c) => (
                <button key={c} type="button" onClick={() => setAccentColor(c)}
                  className="w-8 h-8 rounded-full transition-transform hover:scale-110 border-2 shadow-sm"
                  style={{
                    backgroundColor: c,
                    borderColor: accentColor === c ? 'white' : 'transparent',
                    outline: accentColor === c ? `2px solid ${c}` : 'none',
                    outlineOffset: '2px',
                  }} />
              ))}
              <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)}
                className="w-8 h-8 rounded-full cursor-pointer bg-transparent border-0" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div>
              <p className="text-sm font-medium text-slate-900">Status</p>
              <p className="text-xs text-slate-500 mt-0.5">Toggle whether signups are open</p>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isActive ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Milestones */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-slate-900">Reward Milestones</h2>
              <p className="text-xs text-slate-500 mt-0.5">Displayed as progress goals on the waitlist page</p>
            </div>
            <button type="button" onClick={() => setMilestones([...milestones, { count: 0, reward: '' }])}
              className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
              <Plus size={14} /> Add
            </button>
          </div>

          <div className="space-y-3">
            {milestones.map((m, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-28">
                  <label className="block text-xs text-slate-500 font-medium mb-1">Signups</label>
                  <input type="number" min={1} value={m.count}
                    onChange={(e) => { const u = [...milestones]; u[i] = { ...u[i], count: Number(e.target.value) }; setMilestones(u); }}
                    className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none transition-colors" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-slate-500 font-medium mb-1">Reward</label>
                  <input type="text" value={m.reward}
                    onChange={(e) => { const u = [...milestones]; u[i] = { ...u[i], reward: e.target.value }; setMilestones(u); }}
                    className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors"
                    placeholder="Early access + 20% off" />
                </div>
                <button type="button" onClick={() => setMilestones(milestones.filter((_, idx) => idx !== i))}
                  className="mt-5 p-2 text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {milestones.length === 0 && (
            <div className="text-center py-6 text-slate-400 text-sm border border-dashed border-slate-200 rounded-lg mt-2">
              No milestones yet. Add one to incentivize referrals.
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="flex-1 btn-primary disabled:opacity-60 py-3 text-sm flex items-center justify-center gap-2">
            {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> :
             saved ? <><CheckCircle2 size={16} /> Saved!</> :
             <><Save size={16} /> Save Changes</>}
          </button>
          <button type="button" onClick={handleDelete}
            className="px-5 py-3 border border-red-200 text-red-600 hover:bg-red-50 rounded-[10px] text-sm font-medium transition-colors">
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}
