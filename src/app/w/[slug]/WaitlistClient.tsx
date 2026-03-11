'use client';

import { useState, useEffect } from 'react';
import { Trophy, Share2, Copy, CheckCircle2, Users, Gift, Loader2, Twitter, Linkedin } from 'lucide-react';
import type { Project, WaitlistEntry, Milestone } from '@/lib/supabase/types';
import { buildReferralUrl, formatNumber, ordinal } from '@/lib/utils';

interface Props {
  project: Project;
  leaderboard: WaitlistEntry[];
  totalSignups: number;
  referralCode?: string;
}

interface SignedUpEntry {
  id: string;
  email: string;
  referral_code: string;
  position: number;
  referral_count: number;
}

function getMedalEmoji(rank: number) {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
}

function maskEmail(email: string) {
  const [user, domain] = email.split('@');
  return `${user[0]}${'*'.repeat(Math.min(user.length - 2, 4))}${user[user.length - 1]}@${domain}`;
}

export default function WaitlistClient({ project, leaderboard, totalSignups, referralCode }: Props) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [signedUp, setSignedUp] = useState<SignedUpEntry | null>(null);
  const [copied, setCopied] = useState(false);
  const [liveCount, setLiveCount] = useState(totalSignups);
  const [liveLeaderboard, setLiveLeaderboard] = useState(leaderboard);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? (typeof window !== 'undefined' ? window.location.origin : '');
  const myReferralUrl = signedUp ? buildReferralUrl(appUrl, project.slug, signedUp.referral_code) : '';

  // Sort milestones
  const milestones: Milestone[] = [...(project.milestones ?? [])].sort((a, b) => a.count - b.count);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/waitlist/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: name.trim() || undefined,
          projectId: project.id,
          referralCode: referralCode ?? null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }

      setSignedUp(data.entry);
      if (!data.alreadySignedUp) {
        setLiveCount(c => c + 1);
      }
    } catch {
      setError('Network error. Please try again.');
    }

    setSubmitting(false);
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(myReferralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tweetText = encodeURIComponent(
    `I just joined the ${project.name} waitlist! 🚀 Use my referral link to skip ahead: ${myReferralUrl}`
  );

  const linkedInText = encodeURIComponent(
    `I just joined the ${project.name} waitlist. Check it out: ${myReferralUrl}`
  );

  // Find next milestone
  const nextMilestone = milestones.find(m => m.count > liveCount);
  const lastMilestone = milestones.filter(m => m.count <= liveCount).pop();
  const milestoneProgress = nextMilestone
    ? Math.min((liveCount / nextMilestone.count) * 100, 100)
    : 100;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: project.bg_color ?? '#0f0f1a' }}
    >
      {/* Subtle background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: project.accent_color }}
        />
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center py-16 px-6">
        <div className="w-full max-w-lg">
          {/* Referral badge */}
          {referralCode && !signedUp && (
            <div
              className="mb-6 text-center text-sm px-4 py-2 rounded-full border"
              style={{
                color: project.accent_color,
                borderColor: `${project.accent_color}40`,
                backgroundColor: `${project.accent_color}10`,
              }}
            >
              🎁 You were invited! Signing up will give your friend credit.
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-10">
            {project.logo_url && (
              <img src={project.logo_url} alt={project.name} className="w-16 h-16 rounded-xl mx-auto mb-4 object-cover" />
            )}
            <div
              className="inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
              style={{ color: project.accent_color, backgroundColor: `${project.accent_color}15` }}
            >
              🚀 Coming Soon
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
              {project.headline}
            </h1>
            {project.subheadline && (
              <p className="text-gray-400 text-lg leading-relaxed">{project.subheadline}</p>
            )}

            {/* Signup count */}
            {liveCount > 0 && (
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-400">
                <Users size={14} />
                <span>
                  <span className="text-white font-semibold">{formatNumber(liveCount)}</span> people already joined
                </span>
              </div>
            )}
          </div>

          {/* Main card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 mb-6">
            {!signedUp ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name (optional)"
                  className="w-full bg-white/5 border border-white/10 focus:border-white/30 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full bg-white/5 border border-white/10 focus:border-white/30 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors"
                />

                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full font-semibold py-3.5 rounded-xl text-white transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60"
                  style={{ backgroundColor: project.accent_color }}
                >
                  {submitting ? (
                    <><Loader2 size={16} className="animate-spin" /> Joining…</>
                  ) : (
                    project.cta_text
                  )}
                </button>

                <p className="text-center text-xs text-gray-600">
                  No spam, ever. Unsubscribe anytime.
                </p>
              </form>
            ) : (
              /* Post-signup state */
              <div className="animate-fade-in text-center">
                <div className="text-4xl mb-3">🎉</div>
                <h2 className="text-xl font-bold text-white mb-1">You&apos;re in!</h2>
                <p className="text-gray-400 text-sm mb-1">
                  You&apos;re{' '}
                  <span className="text-white font-semibold">{ordinal(signedUp.position)}</span> on the list
                </p>
                <p className="text-gray-500 text-xs mb-6">{signedUp.email}</p>

                {/* Referral section */}
                <div className="border border-white/10 rounded-xl p-4 text-left">
                  <p className="text-sm font-semibold text-white mb-1 flex items-center gap-1.5">
                    <Share2 size={14} style={{ color: project.accent_color }} />
                    Refer friends to move up
                  </p>
                  <p className="text-xs text-gray-400 mb-3">
                    {signedUp.referral_count > 0
                      ? `You&apos;ve referred ${signedUp.referral_count} friend${signedUp.referral_count !== 1 ? 's' : ''} so far!`
                      : 'Share your link to climb the leaderboard and unlock rewards.'}
                  </p>

                  <div className="flex gap-2 mb-3">
                    <input
                      readOnly
                      value={myReferralUrl}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-300 outline-none font-mono"
                    />
                    <button
                      onClick={copyReferralLink}
                      className="px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium text-white"
                      style={{ backgroundColor: project.accent_color }}
                    >
                      {copied ? <CheckCircle2 size={13} /> : <Copy size={13} />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  {/* Social share */}
                  <div className="flex gap-2">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${tweetText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-sky-400 text-xs font-medium transition-colors"
                    >
                      <Twitter size={12} /> Tweet
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(myReferralUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 text-xs font-medium transition-colors"
                    >
                      <Linkedin size={12} /> Share
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Milestone progress */}
          {milestones.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 mb-6">
              <h3 className="font-semibold text-white text-sm flex items-center gap-2 mb-4">
                <Gift size={15} style={{ color: project.accent_color }} />
                Reward Milestones
              </h3>

              {/* Progress bar */}
              {nextMilestone && (
                <div className="mb-5">
                  <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span>{formatNumber(liveCount)} signups</span>
                    <span>Next: {formatNumber(nextMilestone.count)}</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${milestoneProgress}%`, backgroundColor: project.accent_color }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatNumber(Math.max(0, nextMilestone.count - liveCount))} more to unlock next reward
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {milestones.map((m, i) => {
                  const unlocked = liveCount >= m.count;
                  return (
                    <div
                      key={i}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                        unlocked
                          ? 'border-green-500/30 bg-green-500/5'
                          : 'border-white/5 bg-white/2'
                      }`}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold mt-0.5 shrink-0"
                        style={{
                          backgroundColor: unlocked ? '#22c55e22' : `${project.accent_color}22`,
                          color: unlocked ? '#22c55e' : project.accent_color,
                          border: `1px solid ${unlocked ? '#22c55e40' : `${project.accent_color}40`}`,
                        }}
                      >
                        {unlocked ? '✓' : formatNumber(m.count)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${unlocked ? 'text-green-300' : 'text-gray-300'}`}>
                          {m.reward}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {unlocked
                            ? '✅ Unlocked!'
                            : `At ${formatNumber(m.count)} signups`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Leaderboard */}
          {liveLeaderboard.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
              <h3 className="font-semibold text-white text-sm flex items-center gap-2 mb-4">
                <Trophy size={15} className="text-yellow-400" />
                Referral Leaderboard
              </h3>

              <div className="space-y-2">
                {liveLeaderboard.map((entry, i) => (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                      signedUp?.id === entry.id
                        ? 'border border-white/20 bg-white/5'
                        : 'hover:bg-white/3'
                    }`}
                  >
                    <span className="text-base w-7 text-center shrink-0">
                      {getMedalEmoji(i + 1)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-200 truncate">
                        {maskEmail(entry.email)}
                        {signedUp?.id === entry.id && (
                          <span className="ml-1 text-xs" style={{ color: project.accent_color }}>(you)</span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-sm font-bold" style={{ color: project.accent_color }}>
                        {entry.referral_count}
                      </span>
                      <span className="text-xs text-gray-500">refs</span>
                    </div>
                  </div>
                ))}
              </div>

              {signedUp && !liveLeaderboard.find(e => e.id === signedUp.id) && (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-xs text-gray-500 text-center">
                    You&apos;re not on the leaderboard yet. Refer friends to get on it!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Powered by footer */}
      <footer className="relative z-10 py-4 text-center">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          Powered by ⚡ WaitBoost
        </a>
      </footer>
    </div>
  );
}
