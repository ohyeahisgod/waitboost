export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: 'free' | 'pro';
  created_at: string;
  updated_at: string;
}

export interface Milestone {
  count: number;
  reward: string;
}

export interface Project {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  headline: string;
  subheadline: string | null;
  cta_text: string;
  accent_color: string;
  bg_color: string;
  logo_url: string | null;
  milestones: Milestone[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WaitlistEntry {
  id: string;
  project_id: string;
  email: string;
  name: string | null;
  referral_code: string;
  referred_by_id: string | null;
  referral_count: number;
  position: number;
  created_at: string;
}

export interface ProjectWithStats extends Project {
  total_signups: number;
  referred_signups: number;
}
