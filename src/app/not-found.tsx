import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 px-6 text-center">
      <div className="text-7xl mb-4">🔍</div>
      <h1 className="text-3xl font-bold mb-2">Page not found</h1>
      <p className="text-gray-400 mb-8">This waitlist doesn&apos;t exist or has been removed.</p>
      <Link
        href="/"
        className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        Back to WaitBoost
      </Link>
    </div>
  );
}
