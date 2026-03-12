type BadgeVariant = 'green' | 'slate' | 'indigo' | 'amber' | 'red' | 'blue';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  green:  'bg-green-50  text-green-700  border-green-200',
  slate:  'bg-slate-100 text-slate-600  border-slate-200',
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  amber:  'bg-amber-50  text-amber-700  border-amber-200',
  red:    'bg-red-50    text-red-700    border-red-200',
  blue:   'bg-blue-50   text-blue-700   border-blue-200',
};

const dotClasses: Record<BadgeVariant, string> = {
  green:  'bg-green-500',
  slate:  'bg-slate-400',
  indigo: 'bg-indigo-500',
  amber:  'bg-amber-500',
  red:    'bg-red-500',
  blue:   'bg-blue-500',
};

export function Badge({ children, variant = 'slate', dot = false, className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold rounded-full border',
        variantClasses[variant],
        className,
      ].join(' ')}
    >
      {dot && <span className={['w-1.5 h-1.5 rounded-full shrink-0', dotClasses[variant]].join(' ')} />}
      {children}
    </span>
  );
}
