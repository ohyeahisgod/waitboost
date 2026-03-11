import Link from 'next/link';
import { ArrowRight, Zap, Trophy, Users, BarChart3, Share2, CheckCircle2, Star } from 'lucide-react';
import { PLANS } from '@/lib/stripe';

const FEATURES = [
  {
    icon: Zap,
    title: 'Launch in Minutes',
    desc: 'Create a beautiful waitlist page with a headline, signup form, and referral link — no code required.',
  },
  {
    icon: Share2,
    title: 'Viral Referral Engine',
    desc: 'Every signup gets a unique referral link. Watch your list grow organically as fans share your waitlist.',
  },
  {
    icon: Trophy,
    title: 'Live Leaderboard',
    desc: 'A public leaderboard gamifies sharing. Top referrers compete for your milestone rewards.',
  },
  {
    icon: Users,
    title: 'Reward Milestones',
    desc: 'Set milestone rewards (e.g. "Refer 5 friends → Beta access") to motivate your biggest advocates.',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    desc: 'Track total signups, referred signups, conversion rate, and top referrers in your dashboard.',
  },
  {
    icon: ArrowRight,
    title: 'CSV Export',
    desc: 'Download your entire waitlist as a CSV to import into your email tool or CRM.',
  },
];

const TESTIMONIALS = [
  {
    quote: "WaitBoost helped us get 4,000 signups before launch. The referral leaderboard was addictive for our beta users.",
    name: "Sara K.",
    title: "Founder, Loopkit",
  },
  {
    quote: "Set up in 10 minutes. Our referral rate hit 38%. It basically ran itself.",
    name: "Marcus T.",
    title: "CEO, Draftly AI",
  },
  {
    quote: "The milestone rewards turned our fans into a growth team. Best pre-launch investment we made.",
    name: "Priya R.",
    title: "Co-Founder, Flowstep",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-gray-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-2xl">⚡</span>
            <span className="gradient-text">WaitBoost</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="text-sm bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shine"
            >
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 text-sm text-brand-300 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 mb-8">
            <Star size={12} className="fill-brand-400 text-brand-400" />
            <span>Trusted by 1,200+ startup founders</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6">
            Build viral waitlists
            <br />
            <span className="gradient-text">that sell themselves</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Launch a referral-powered waitlist in minutes. Every signup gets a unique
            referral link. A live leaderboard turns your early fans into your growth team.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shine shadow-lg shadow-brand-900/40"
            >
              Start for free
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/w/demo-waitlist"
              className="flex items-center gap-2 text-gray-300 hover:text-white border border-white/10 hover:border-white/20 px-8 py-4 rounded-xl font-medium text-lg transition-colors"
            >
              See a live demo
            </Link>
          </div>

          <p className="mt-4 text-sm text-gray-500">Free plan • No credit card required</p>
        </div>

        {/* Hero screenshot mockup */}
        <div className="relative mx-auto mt-20 max-w-5xl">
          <div className="glass rounded-2xl overflow-hidden border border-white/5 shadow-2xl shadow-black/50 p-1">
            <div className="bg-gray-900 rounded-xl p-6">
              {/* Mock browser bar */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <div className="ml-4 flex-1 bg-gray-800 rounded-md h-6 text-xs text-gray-500 flex items-center px-3">
                  waitboost.com/w/your-startup
                </div>
              </div>
              {/* Mock waitlist page */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 text-left">
                  <div className="text-xs text-brand-400 font-medium mb-2 uppercase tracking-widest">🚀 Coming Soon</div>
                  <div className="text-2xl font-bold mb-2">The future of task management</div>
                  <div className="text-gray-400 text-sm mb-4">Be the first to get access. Refer friends to move up the list.</div>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-gray-800 rounded-lg h-10 text-xs text-gray-500 flex items-center px-3">your@email.com</div>
                    <div className="bg-brand-600 text-white text-xs px-4 rounded-lg flex items-center font-medium">Join →</div>
                  </div>
                  <div className="mt-4 text-xs text-gray-500">🎉 2,341 people already on the list</div>
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1">
                    <Trophy size={12} className="text-yellow-400" /> Leaderboard
                  </div>
                  {[
                    { name: 'alex@startup.io', refs: 47, medal: '🥇' },
                    { name: 'sarah@techco.com', refs: 31, medal: '🥈' },
                    { name: 'mike@devhub.io', refs: 22, medal: '🥉' },
                  ].map((u) => (
                    <div key={u.name} className="flex items-center justify-between py-1.5 border-b border-white/5 text-xs">
                      <span className="text-gray-300">{u.medal} {u.name}</span>
                      <span className="text-brand-400 font-medium">{u.refs} refs</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Everything you need to launch
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              WaitBoost gives founders a complete toolkit to turn interest into a
              self-sustaining growth flywheel.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="glass rounded-2xl p-6 hover:border-brand-500/30 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center mb-4 group-hover:bg-brand-500/20 transition-colors">
                  <f.icon size={20} className="text-brand-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-gray-900/30">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Loved by founders
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="glass rounded-2xl p-6">
                <div className="flex mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="font-medium text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple pricing</h2>
            <p className="text-gray-400 text-lg">
              Start free. Upgrade when you need more.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="glass rounded-2xl p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-1">{PLANS.free.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <p className="text-gray-400 text-sm mt-2">Perfect to get started</p>
              </div>
              <ul className="space-y-3 mb-8">
                {PLANS.free.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/signup"
                className="block w-full text-center border border-brand-500/50 hover:border-brand-400 text-brand-300 hover:text-brand-200 py-3 rounded-xl font-medium transition-colors"
              >
                Get started free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="relative rounded-2xl p-8 bg-gradient-to-br from-brand-600/20 to-purple-600/20 border border-brand-500/30">
              <div className="absolute -top-3 right-6 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-1">{PLANS.pro.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">${PLANS.pro.price}</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <p className="text-gray-400 text-sm mt-2">For serious launches</p>
              </div>
              <ul className="space-y-3 mb-8">
                {PLANS.pro.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle2 size={16} className="text-brand-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/signup"
                className="block w-full text-center bg-brand-600 hover:bg-brand-500 text-white py-3 rounded-xl font-semibold transition-colors shine"
              >
                Start Pro trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to boost your
            <br />
            <span className="gradient-text">pre-launch growth?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            Join 1,200+ founders who launched with WaitBoost.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shine shadow-lg shadow-brand-900/40"
          >
            Launch your waitlist
            <ArrowRight size={18} />
          </Link>
          <p className="mt-4 text-sm text-gray-500">Free forever • No credit card needed</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-400">
            <span>⚡</span>
            <span className="font-semibold text-white">WaitBoost</span>
            <span className="text-gray-600">·</span>
            <span className="text-sm">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
            <a href="mailto:hello@waitboost.co" className="hover:text-gray-300 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
