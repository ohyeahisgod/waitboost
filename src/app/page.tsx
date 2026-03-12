'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight, Check, ChevronDown, ChevronUp,
  Trophy, Gift, BarChart3, Zap, Download,
  Share2, TrendingUp, Menu, X,
  UserPlus, Target, Link2,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────
// DASHBOARD MOCKUP
// ─────────────────────────────────────────────────────────
function DashboardMockup() {
  return (
    <div className="w-full max-w-lg ml-auto select-none">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/60 overflow-hidden">

        {/* Browser chrome */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-300" />
          </div>
          <div className="flex-1 bg-white border border-slate-200 rounded-md h-5 flex items-center px-2.5 max-w-[240px] mx-auto">
            <span className="text-[10px] text-slate-400 font-mono truncate">
              app.waitboost.com/dashboard
            </span>
          </div>
        </div>

        {/* Dashboard body */}
        <div className="p-4 space-y-3 bg-white">

          {/* Project header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900">Acme Launch 🚀</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">waitboost.com/w/acme-launch</div>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-emerald-700 font-semibold">Live</span>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Total Signups', value: '2,847', delta: '+12%' },
              { label: 'Referral Rate', value: '34%',   delta: '+5%'  },
              { label: 'Conversions',   value: '241',    delta: '+8%'  },
            ].map(s => (
              <div key={s.label} className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                <div className="text-[9px] text-slate-400 uppercase tracking-wide mb-1">{s.label}</div>
                <div className="text-[15px] font-bold text-slate-900 leading-none mb-1">{s.value}</div>
                <div className="text-[9px] font-semibold text-emerald-600">{s.delta} this week</div>
              </div>
            ))}
          </div>

          {/* Sparkline */}
          <div className="bg-slate-50 rounded-xl border border-slate-100 px-3 pt-3 pb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-medium text-slate-500">Signups over time</span>
              <span className="text-[10px] text-slate-400">Last 14 days</span>
            </div>
            <svg viewBox="0 0 300 52" className="w-full h-10 overflow-visible">
              <defs>
                <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,48 C15,44 30,40 50,36 C70,32 85,28 105,24 C125,20 140,16 160,13 C180,10 200,8 220,6 C240,4 260,2.5 280,1.5 L300,1"
                fill="none"
                stroke="#818cf8"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M0,48 C15,44 30,40 50,36 C70,32 85,28 105,24 C125,20 140,16 160,13 C180,10 200,8 220,6 C240,4 260,2.5 280,1.5 L300,1 L300,52 L0,52 Z"
                fill="url(#sparkGrad)"
              />
              <circle cx="300" cy="1" r="2.5" fill="#6366f1" />
              <circle cx="300" cy="1" r="4" fill="#6366f1" fillOpacity="0.2" />
            </svg>
          </div>

          {/* Top referrers */}
          <div className="rounded-xl border border-slate-100 overflow-hidden">
            <div className="bg-slate-50 px-3 py-2 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Trophy className="w-3 h-3 text-amber-500" />
                <span className="text-[10px] font-semibold text-slate-500">Top Referrers</span>
              </div>
              <span className="text-[10px] text-slate-400">Refs</span>
            </div>
            {[
              { name: 'alex@startup.io',      refs: 47, medal: '🥇' },
              { name: 'maya@producthunt.co',  refs: 32, medal: '🥈' },
              { name: 'dan@yc-founder.com',   refs: 28, medal: '🥉' },
            ].map(u => (
              <div key={u.name} className="px-3 py-2 flex items-center justify-between border-b border-slate-50 last:border-0 bg-white">
                <div className="flex items-center gap-2">
                  <span className="text-xs w-4">{u.medal}</span>
                  <div className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-[8px] text-indigo-600 font-bold">{u.name[0].toUpperCase()}</span>
                  </div>
                  <span className="text-[10px] text-slate-600 font-mono truncate max-w-[110px]">{u.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-800">{u.refs}</span>
              </div>
            ))}
          </div>

          {/* Share link */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3">
            <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500 mb-1.5">
              <Link2 className="w-3 h-3" />
              Your invite link
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1.5 font-mono text-[10px] text-slate-500 truncate">
                waitboost.com/w/acme-launch
              </div>
              <button className="bg-slate-900 text-white text-[10px] font-semibold px-2.5 py-1.5 rounded-lg whitespace-nowrap">
                Copy
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: <Share2 className="w-4 h-4" />,
    title: 'Referral tracking',
    desc: 'Every signup gets a unique invite link. Track shares, clicks, and conversions per referrer automatically.',
  },
  {
    icon: <Trophy className="w-4 h-4" />,
    title: 'Public leaderboard',
    desc: 'Turn your waitlist into a competition. A live leaderboard motivates sharing and rewards your top advocates.',
  },
  {
    icon: <Gift className="w-4 h-4" />,
    title: 'Custom rewards',
    desc: 'Define milestones and offer rewards when users hit referral goals — early access, discounts, or swag.',
  },
  {
    icon: <BarChart3 className="w-4 h-4" />,
    title: 'Campaign analytics',
    desc: 'See referral rates, traffic sources, daily growth, and conversion data in one clean dashboard.',
  },
  {
    icon: <Zap className="w-4 h-4" />,
    title: 'No-code setup',
    desc: 'Create and embed your waitlist in minutes without touching a line of code. Just copy and paste.',
  },
  {
    icon: <Download className="w-4 h-4" />,
    title: 'Export & segmentation',
    desc: 'Filter your list by referral count, sign-up date, or source. Export to CSV or sync via webhook.',
  },
]

const PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    desc: 'For founders testing their first idea.',
    popular: false,
    dark: false,
    cta: 'Start free',
    href: '/auth/signup',
    features: [
      'Up to 500 signups',
      'Referral tracking',
      'Public leaderboard',
      'Basic analytics',
      'WaitBoost branding',
    ],
  },
  {
    name: 'Growth',
    price: '$19',
    sub: '/mo',
    desc: 'For teams ready to grow their launch.',
    popular: true,
    dark: true,
    cta: 'Start free trial',
    href: '/auth/signup',
    features: [
      'Unlimited signups',
      'Custom domain',
      'Full campaign analytics',
      'Custom rewards',
      'Remove WaitBoost branding',
      'Email integrations',
    ],
  },
  {
    name: 'Scale',
    price: '$49',
    sub: '/mo',
    desc: 'For larger launches and multiple products.',
    popular: false,
    dark: false,
    cta: 'Start free trial',
    href: '/auth/signup',
    features: [
      'Everything in Growth',
      'Multiple projects',
      'Priority support',
      'Webhook integrations',
      'Custom email templates',
      'Team access',
    ],
  },
]

const FAQS = [
  {
    q: 'How does referral ranking work?',
    a: 'Every user who joins your waitlist gets a unique shareable link. When someone signs up through that link, the referrer is credited. Rankings on the leaderboard are based on total successful referrals.',
  },
  {
    q: 'Can I use my own domain?',
    a: 'Yes — on the Growth and Scale plans you can connect a custom domain so your waitlist page matches your brand. Setup takes about two minutes with a simple DNS record.',
  },
  {
    q: 'Do I need to install anything?',
    a: "No. WaitBoost works as an embedded form you paste into your site, or as a hosted page we serve for you. No npm packages, no SDKs — just copy a snippet and you're live.",
  },
  {
    q: 'Can I export my waitlist?',
    a: 'Yes. You can export your entire waitlist as a CSV file at any time. On Growth and Scale plans you can also configure webhooks to push new signups directly into your own tools.',
  },
  {
    q: 'Is there a free plan?',
    a: 'Yes — the Starter plan is free forever and supports up to 500 signups with core referral tracking included. You can upgrade at any point as your launch scales.',
  },
]

// ─────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────
export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">

      {/* ══════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">

          {/* Left: logo + nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-6 h-6 bg-slate-900 rounded-[6px] flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-semibold text-slate-900 text-[15px] tracking-tight">WaitBoost</span>
            </Link>
            <nav className="hidden md:flex items-center">
              {[
                { label: 'Features',   href: '#features'  },
                { label: 'Pricing',    href: '#pricing'   },
                { label: 'Changelog',  href: '#'          },
                { label: 'Docs',       href: '#'          },
              ].map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm text-slate-500 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-md hover:bg-slate-50"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: auth */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/auth/login"
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-md hover:bg-slate-50"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="text-sm bg-slate-900 text-white font-medium px-3.5 py-1.5 rounded-[10px] hover:bg-slate-800 transition-colors"
            >
              Start free
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1.5 rounded-md hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-6 py-4 space-y-1">
            {['Features', 'Pricing', 'Changelog', 'Docs'].map(item => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block text-sm text-slate-600 hover:text-slate-900 px-2 py-2 rounded-md hover:bg-slate-50"
                onClick={() => setMobileOpen(false)}
              >
                {item}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link href="/auth/login" className="text-sm text-center py-2 border border-slate-200 rounded-[10px] hover:bg-slate-50">
                Sign in
              </Link>
              <Link href="/auth/signup" className="text-sm text-center bg-slate-900 text-white py-2 rounded-[10px] hover:bg-slate-800">
                Start free
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div className="max-w-xl">
              {/* Beta badge */}
              <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Now in public beta
              </div>

              <h1 className="text-5xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-6">
                Turn your waitlist into{' '}
                <span className="text-indigo-600">measurable growth</span>
              </h1>

              <p className="text-lg text-slate-500 leading-relaxed mb-8">
                Launch a referral-powered waitlist that helps you acquire early users, reward sharing, and track conversions from one clean dashboard.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center gap-2 bg-slate-900 text-white text-sm font-medium px-5 py-2.5 rounded-[10px] hover:bg-slate-800 transition-colors"
                >
                  Start free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 border border-slate-200 px-5 py-2.5 rounded-[10px] hover:bg-slate-50 transition-colors"
                >
                  Book demo
                </Link>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap items-center gap-5 text-sm text-slate-400">
                {['No credit card required', 'Setup in 10 minutes'].map(t => (
                  <div key={t} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2.5} />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: dashboard */}
            <div className="hidden lg:block">
              <DashboardMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SOCIAL PROOF
      ══════════════════════════════════════ */}
      <section className="py-14 px-6 border-y border-slate-100 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs text-slate-400 font-medium uppercase tracking-widest mb-8">
            Helping founders and product teams launch smarter
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
            {['Aeroform', 'Stackbase', 'Pathfinder', 'Luminary', 'Cortex', 'Fieldwork'].map(name => (
              <span key={name} className="text-slate-300 font-bold text-sm tracking-wide select-none">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PROBLEM / SOLUTION
      ══════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <div>
              <div className="inline-block text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-4">
                The problem
              </div>
              <h2 className="text-3xl font-bold text-slate-900 leading-tight tracking-tight mb-5">
                Most waitlists collect emails. Few actually drive distribution.
              </h2>
              <p className="text-slate-500 leading-relaxed text-[15px]">
                A standard sign-up form is a dead end. You collect email addresses but have no mechanism to grow beyond your existing audience. WaitBoost turns your waitlist page into a referral engine that compounds over time.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: <Share2 className="w-4 h-4 text-indigo-600" />,
                  title: 'Every signup becomes a distribution channel',
                  desc: 'Each new user gets a unique link. When they share it, your waitlist grows without any extra effort from you.',
                },
                {
                  icon: <TrendingUp className="w-4 h-4 text-indigo-600" />,
                  title: 'Growth compounds automatically',
                  desc: 'Referrals attract more referrals. The leaderboard creates friendly competition that sustains momentum long after launch.',
                },
                {
                  icon: <BarChart3 className="w-4 h-4 text-indigo-600" />,
                  title: 'You can measure everything',
                  desc: 'See exactly where your signups come from, which referrers drive the most value, and what actually converts.',
                },
              ].map(item => (
                <div key={item.title} className="flex gap-4 p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:border-slate-200 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm mb-1">{item.title}</div>
                    <div className="text-sm text-slate-500 leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES GRID
      ══════════════════════════════════════ */}
      <section id="features" className="py-24 px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-block text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-4">
              Features
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
              Everything you need for a successful launch
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto text-[15px]">
              WaitBoost comes with the full toolkit to run your pre-launch campaign — from the first signup to the last conversion.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(f => (
              <div
                key={f.title}
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2 text-[15px]">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PRODUCT SHOWCASE
      ══════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-block text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-4">
              Product
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
              Built for your entire pre-launch workflow
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto text-[15px]">
              From the signup form to the leaderboard to the analytics dashboard — everything in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">

            {/* Leaderboard card */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-5 py-4 border-b border-slate-200">
                <div className="font-semibold text-sm text-slate-900 mb-0.5">Public leaderboard</div>
                <div className="text-xs text-slate-400">Keep users engaged and competing</div>
              </div>
              <div className="p-4 space-y-2.5 bg-white">
                {[
                  { rank: '🥇', name: 'Alex M.',  refs: 47, w: '100%' },
                  { rank: '🥈', name: 'Maya K.',  refs: 32, w: '68%'  },
                  { rank: '🥉', name: 'Dan H.',   refs: 28, w: '60%'  },
                  { rank: '4',  name: 'Priya S.', refs: 19, w: '40%'  },
                  { rank: '5',  name: 'Tom L.',   refs: 12, w: '26%'  },
                ].map(u => (
                  <div key={u.name} className="flex items-center gap-2.5">
                    <span className="text-xs w-5 text-center flex-shrink-0">{u.rank}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-slate-700 truncate">{u.name}</span>
                        <span className="text-slate-400 ml-2 flex-shrink-0">{u.refs} refs</span>
                      </div>
                      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-400 rounded-full" style={{ width: u.w }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Analytics card */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-5 py-4 border-b border-slate-200">
                <div className="font-semibold text-sm text-slate-900 mb-0.5">Campaign analytics</div>
                <div className="text-xs text-slate-400">Know exactly what&apos;s driving growth</div>
              </div>
              <div className="p-4 space-y-3 bg-white">
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-2">
                    <span>Daily signups</span>
                    <span>↑ 23% this week</span>
                  </div>
                  <svg viewBox="0 0 200 48" className="w-full h-9 overflow-visible">
                    <defs>
                      <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,44 L25,38 L50,32 L75,26 L100,22 L125,16 L150,11 L175,7 L200,3"
                      fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round"
                    />
                    <path
                      d="M0,44 L25,38 L50,32 L75,26 L100,22 L125,16 L150,11 L175,7 L200,3 L200,48 L0,48 Z"
                      fill="url(#analyticsGrad)"
                    />
                  </svg>
                </div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Traffic sources</div>
                {[
                  { src: 'Direct share', pct: '42%', color: 'bg-indigo-500' },
                  { src: 'Twitter / X',  pct: '31%', color: 'bg-sky-400'    },
                  { src: 'LinkedIn',     pct: '18%', color: 'bg-blue-500'   },
                  { src: 'Other',        pct: '9%',  color: 'bg-slate-300'  },
                ].map(s => (
                  <div key={s.src} className="flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${s.color} flex-shrink-0`} />
                    <span className="text-slate-600 flex-1">{s.src}</span>
                    <span className="font-semibold text-slate-800">{s.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Embeddable form card */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-5 py-4 border-b border-slate-200">
                <div className="font-semibold text-sm text-slate-900 mb-0.5">Embeddable forms</div>
                <div className="text-xs text-slate-400">Add to any site in seconds</div>
              </div>
              <div className="p-4 bg-white space-y-3">
                <div className="border border-slate-200 rounded-xl p-4">
                  <div className="text-xs font-bold text-slate-800 mb-0.5">Join the waitlist</div>
                  <div className="text-[10px] text-slate-400 mb-3">Be first in line for early access.</div>
                  <div className="space-y-2 mb-3">
                    <div className="w-full text-[10px] px-2.5 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-400">
                      Your name
                    </div>
                    <div className="w-full text-[10px] px-2.5 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-400">
                      Email address
                    </div>
                  </div>
                  <div className="bg-slate-900 text-white text-[10px] text-center py-2 rounded-lg font-semibold">
                    Join waitlist →
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-[10px] text-slate-400">Paste snippet from dashboard</div>
                  <div className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded font-mono">&lt;/&gt;</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PRICING
      ══════════════════════════════════════ */}
      <section id="pricing" className="py-24 px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-block text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-4">
              Pricing
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
              Simple, transparent pricing
            </h2>
            <p className="text-slate-500 text-[15px]">
              Start free. Upgrade when your launch takes off.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 items-start">
            {PLANS.map(plan => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-6 relative ${
                  plan.dark
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-white border-slate-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <div className="bg-indigo-600 text-white text-[10px] font-bold px-3.5 py-1 rounded-full tracking-wide whitespace-nowrap">
                      Most popular
                    </div>
                  </div>
                )}

                <div className={`text-sm font-semibold mb-2 ${plan.dark ? 'text-slate-200' : 'text-slate-600'}`}>
                  {plan.name}
                </div>
                <div className="flex items-baseline gap-0.5 mb-1">
                  <span className={`text-3xl font-bold ${plan.dark ? 'text-white' : 'text-slate-900'}`}>
                    {plan.price}
                  </span>
                  {plan.sub && (
                    <span className={`text-sm ${plan.dark ? 'text-slate-400' : 'text-slate-400'}`}>{plan.sub}</span>
                  )}
                </div>
                <div className={`text-xs mb-5 leading-relaxed ${plan.dark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {plan.desc}
                </div>

                <Link
                  href={plan.href}
                  className={`block text-center text-sm font-semibold py-2.5 rounded-[10px] mb-6 transition-colors ${
                    plan.dark
                      ? 'bg-white text-slate-900 hover:bg-slate-100'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {plan.cta}
                </Link>

                <div className={`text-[10px] font-semibold uppercase tracking-wider mb-3 ${plan.dark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Includes
                </div>
                <ul className="space-y-2.5">
                  {plan.features.map(feat => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm">
                      <Check
                        className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${plan.dark ? 'text-indigo-400' : 'text-emerald-500'}`}
                        strokeWidth={2.5}
                      />
                      <span className={plan.dark ? 'text-slate-300' : 'text-slate-600'}>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FAQ
      ══════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-4">
              FAQ
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
              Frequently asked questions
            </h2>
            <p className="text-slate-500 text-[15px]">
              Have more questions?{' '}
              <Link href="#" className="text-indigo-600 hover:underline underline-offset-2">
                Talk to us.
              </Link>
            </p>
          </div>

          <div className="space-y-1.5">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden">
                <button
                  className="w-full text-left flex items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-medium text-slate-900 text-sm">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 pt-1 text-sm text-slate-500 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════ */}
      <section className="py-24 px-6 bg-slate-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-4">
            Launch your next product with a waitlist that actually grows
          </h2>
          <p className="text-slate-400 mb-8 leading-relaxed text-[15px]">
            Join hundreds of founders using WaitBoost to turn their pre-launch into a growth flywheel.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-7">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 bg-white text-slate-900 text-sm font-semibold px-5 py-2.5 rounded-[10px] hover:bg-slate-100 transition-colors"
            >
              Start free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 border border-slate-700 px-5 py-2.5 rounded-[10px] hover:border-slate-600 hover:text-slate-200 transition-colors"
            >
              View live demo
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-slate-500">
            {['No credit card required', 'Free forever plan', 'Setup in minutes'].map(t => (
              <div key={t} className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2.5} />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className="bg-white border-t border-slate-200 py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">

            {/* Brand */}
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-slate-900 rounded-[6px] flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                </div>
                <span className="font-semibold text-slate-900 text-[15px] tracking-tight">WaitBoost</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed max-w-[220px]">
                The referral-powered waitlist platform for founders and product teams.
              </p>
            </div>

            {/* Product */}
            <div>
              <div className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-4">Product</div>
              <ul className="space-y-2.5">
                {['Features', 'Pricing', 'Docs', 'Changelog'].map(item => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <div className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-4">Company</div>
              <ul className="space-y-2.5">
                {['About', 'Contact'].map(item => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <div className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-4">Legal</div>
              <ul className="space-y-2.5">
                {['Privacy', 'Terms'].map(item => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-slate-100 pt-6 flex flex-wrap items-center justify-between gap-4">
            <span className="text-sm text-slate-400">© 2026 WaitBoost. All rights reserved.</span>
            <div className="flex items-center gap-4">
              {/* X / Twitter */}
              <Link href="#" className="text-slate-400 hover:text-slate-700 transition-colors text-sm font-medium">
                X / Twitter
              </Link>
              {/* GitHub */}
              <Link href="#" className="text-slate-400 hover:text-slate-700 transition-colors text-sm font-medium">
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
