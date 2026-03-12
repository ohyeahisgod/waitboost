import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'WaitBoost — Viral Waitlists & Referral Leaderboards',
    template: '%s | WaitBoost',
  },
  description:
    'Launch viral waitlists for your startup. Track referrals, show leaderboards, reward your biggest fans.',
  openGraph: {
    title: 'WaitBoost',
    description: 'Launch viral waitlists for your startup.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-white text-slate-900 min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
