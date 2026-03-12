import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  /** Size of the lightning bolt image */
  size?: number;
  /** Whether to wrap in a Link to "/" */
  linked?: boolean;
  /** Color scheme of the wordmark text */
  theme?: 'dark' | 'light';
  className?: string;
}

function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <Image
      src="/logo.svg"
      alt="WaitBoost logo"
      width={size}
      height={Math.round(size * 1.2)}
      className="shrink-0"
      priority
    />
  );
}

function LogoWord({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  return (
    <span
      className={[
        'font-bold text-[17px] tracking-tight leading-none',
        theme === 'light' ? 'text-white' : 'text-slate-900',
      ].join(' ')}
    >
      WaitBoost
    </span>
  );
}

/** Full logo: bolt image + wordmark */
export function Logo({ size = 28, linked = true, theme = 'dark', className = '' }: LogoProps) {
  const inner = (
    <span className={['inline-flex items-center gap-2', className].join(' ')}>
      <LogoMark size={size} />
      <LogoWord theme={theme} />
    </span>
  );

  return linked ? (
    <Link href="/" className="inline-flex items-center gap-2">
      <LogoMark size={size} />
      <LogoWord theme={theme} />
    </Link>
  ) : inner;
}

/** Just the bolt mark (no wordmark) */
export function LogoIcon({ size = 32 }: { size?: number }) {
  return <LogoMark size={size} />;
}
