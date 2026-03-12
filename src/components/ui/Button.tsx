import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-600 hover:border-indigo-700',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200',
  outline:   'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300',
  ghost:     'bg-transparent hover:bg-slate-100 text-slate-600 border border-transparent',
  danger:    'bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300',
};

const sizeClasses: Record<Size, string> = {
  sm:  'h-8  px-3   text-xs  gap-1.5',
  md:  'h-10 px-4   text-sm  gap-2',
  lg:  'h-11 px-5   text-sm  gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, disabled, className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={[
          'inline-flex items-center justify-center font-semibold rounded-[10px] transition-all',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:ring-offset-1',
          variantClasses[variant],
          sizeClasses[size],
          className,
        ].join(' ')}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 size={14} className="animate-spin shrink-0" />
            {children}
          </>
        ) : children}
      </button>
    );
  }
);

Button.displayName = 'Button';
