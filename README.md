# ⚡ WaitBoost

> Viral waitlist & referral leaderboard builder for startup founders.

**WaitBoost** lets you launch a beautiful, referral-powered waitlist page in minutes. Every signup gets a unique referral link. A live leaderboard gamifies sharing. Milestone rewards motivate your biggest advocates.

---

## Features

- **Public Waitlist Page** — Customizable headline, subheadline, accent color, CTA
- **Referral Tracking** — Each signup gets a unique code; `?ref=CODE` attribution
- **Live Leaderboard** — Top referrers shown publicly to drive competition
- **Reward Milestones** — Set goals like "100 signups → Early access"
- **Dashboard** — Overview of all projects, stats at a glance
- **Analytics** — Signups over time, referral rate, top referrers, entry table
- **CSV Export** (Pro) — Download full waitlist as CSV
- **Authentication** — Email/password via Supabase Auth
- **Stripe Billing** — Free plan (1 project, 500 signups) + Pro plan ($29/mo)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database & Auth | Supabase (PostgreSQL + Row Level Security) |
| Payments | Stripe |
| Language | TypeScript |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Marketing landing page
│   ├── auth/
│   │   ├── login/page.tsx          # Sign in
│   │   ├── signup/page.tsx         # Sign up
│   │   └── callback/route.ts       # Auth callback
│   ├── dashboard/
│   │   ├── layout.tsx              # Sidebar layout
│   │   ├── page.tsx                # Projects overview
│   │   ├── new/page.tsx            # Create project wizard
│   │   └── projects/[id]/
│   │       ├── page.tsx            # Project settings
│   │       └── analytics/page.tsx  # Analytics & leaderboard
│   ├── w/[slug]/
│   │   ├── page.tsx                # Public waitlist (SSR)
│   │   └── WaitlistClient.tsx      # Interactive client component
│   └── api/
│       ├── waitlist/
│       │   ├── join/route.ts       # POST: join waitlist
│       │   └── [projectId]/export/ # GET: CSV export (Pro)
│       └── stripe/
│           ├── checkout/route.ts   # POST: create checkout session
│           ├── checkout/upgrade/   # POST: form-based upgrade
│           └── webhook/route.ts    # Stripe webhook handler
├── components/
│   └── DashboardSignOut.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser Supabase client
│   │   ├── server.ts               # Server Supabase client
│   │   └── types.ts                # TypeScript types
│   ├── stripe.ts                   # Stripe client + plan config
│   └── utils.ts                    # Helpers (slugify, formatNumber, etc.)
├── middleware.ts                    # Auth route protection
supabase/
└── schema.sql                      # Full database schema
```

---

## Setup

### 1. Clone and install

```bash
git clone <your-repo>
cd waitboost
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
# Supabase — from your project dashboard
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe — from your Stripe dashboard
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. In **Authentication → URL Configuration**, add:
   - Site URL: `http://localhost:3000`
   - Redirect URL: `http://localhost:3000/auth/callback`

### 4. Set up Stripe

1. Create a product in [Stripe Dashboard](https://dashboard.stripe.com)
   - Name: "WaitBoost Pro"
   - Price: $29/month recurring
   - Copy the `price_...` ID → `STRIPE_PRO_PRICE_ID`
2. Set up a webhook pointing to `https://your-domain.com/api/stripe/webhook`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
3. Copy the webhook signing secret → `STRIPE_WEBHOOK_SECRET`

For local development with Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Plans

| Feature | Free | Pro ($29/mo) |
|---|---|---|
| Projects | 1 | Unlimited |
| Signups per project | 500 | Unlimited |
| Referral tracking | ✅ | ✅ |
| Leaderboard | ✅ | ✅ |
| Analytics | Basic | Advanced |
| CSV Export | ❌ | ✅ |
| Custom branding | ❌ | ✅ |

---

## Referral Flow

1. User visits `/w/your-slug` and signs up → assigned `referral_code` (e.g. `Xk7mQ2pR`)
2. They share `/w/your-slug?ref=Xk7mQ2pR`
3. New visitor clicks link → referral code stored in query param
4. New signup hits `POST /api/waitlist/join` with `referralCode`
5. API looks up the referrer, creates the entry with `referred_by_id`, increments `referral_count`
6. Leaderboard re-renders on page load showing updated counts

---

## Deployment

```bash
# Vercel (recommended)
npm i -g vercel
vercel

# Or build for any Node host
npm run build
npm start
```

Don't forget to add all environment variables to your deployment platform and update:
- `NEXT_PUBLIC_APP_URL` to your production URL
- Supabase redirect URLs to include your production domain
- Stripe webhook URL to point to production

---

## License

MIT
