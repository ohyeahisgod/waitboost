type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  variant?: AlertVariant;
  children: React.ReactNode;
  className?: string;
}

const styles: Record<AlertVariant, string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error:   'bg-red-50   border-red-200   text-red-700',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info:    'bg-blue-50  border-blue-200  text-blue-800',
};

export function Alert({ variant = 'info', children, className = '' }: AlertProps) {
  return (
    <div className={['border rounded-xl px-4 py-3 text-sm', styles[variant], className].join(' ')}>
      {children}
    </div>
  );
}
