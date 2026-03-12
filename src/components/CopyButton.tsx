'use client';

import { useState } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export default function CopyButton({ text, label = 'Copy Link', className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={[
        'inline-flex items-center gap-2 text-sm font-medium transition-all',
        copied ? 'text-green-600' : '',
        className,
      ].join(' ')}
    >
      {copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}
      {copied ? 'Copied!' : label}
    </button>
  );
}
