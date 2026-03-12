import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  prefix?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, prefix, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 mb-1.5">
            {label}
          </label>
        )}
        <div className={[
          'flex items-center bg-white border rounded-lg overflow-hidden transition-all',
          error
            ? 'border-red-300 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-500/10'
            : 'border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10',
        ].join(' ')}>
          {prefix && (
            <span className="px-3 py-3 text-slate-400 text-sm border-r border-slate-200 bg-slate-50 whitespace-nowrap select-none">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={[
              'flex-1 bg-transparent px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none',
              prefix ? 'px-3' : 'px-4',
              className,
            ].join(' ')}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={[
            'w-full bg-white border rounded-lg px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all resize-none',
            error
              ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-500/10'
              : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10',
            className,
          ].join(' ')}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
