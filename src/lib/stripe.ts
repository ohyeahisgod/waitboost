import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
});

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    projectLimit: 1,
    signupLimit: 500,
    features: [
      '1 waitlist project',
      'Up to 500 signups',
      'Referral tracking',
      'Public leaderboard',
      'Basic analytics',
    ],
  },
  pro: {
    name: 'Pro',
    price: 29,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    projectLimit: Infinity,
    signupLimit: Infinity,
    features: [
      'Unlimited projects',
      'Unlimited signups',
      'Referral tracking',
      'Public leaderboard',
      'Advanced analytics',
      'CSV export',
      'Custom branding',
      'Remove WaitBoost branding',
      'Priority support',
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;
