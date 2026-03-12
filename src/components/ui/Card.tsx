interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'flat' | 'inset';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  sm:   'p-4',
  md:   'p-6',
  lg:   'p-8',
};

const variantClasses = {
  default: 'bg-white border border-slate-200 rounded-2xl shadow-sm',
  flat:    'bg-white border border-slate-200 rounded-2xl',
  inset:   'bg-slate-50 border border-slate-200 rounded-xl',
};

export function Card({ children, variant = 'default', padding = 'md', className = '', ...props }: CardProps) {
  return (
    <div
      className={[variantClasses[variant], paddingClasses[padding], className].join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}

// Stat card for the dashboard numbers
interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}

export function StatCard({ label, value, sub, accent = false }: StatCardProps) {
  return (
    <Card variant="default" padding="md">
      <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mb-2">{label}</p>
      <p className={['text-3xl font-bold', accent ? 'text-indigo-600' : 'text-slate-900'].join(' ')}>
        {value}
        {sub && <span className="text-base font-normal text-slate-400 ml-2">{sub}</span>}
      </p>
    </Card>
  );
}
