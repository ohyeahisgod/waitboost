interface DividerProps {
  label?: string;
}

export function Divider({ label }: DividerProps) {
  if (!label) {
    return <div className="h-px bg-slate-200 my-4" />;
  }
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-slate-200" />
      <span className="text-xs text-slate-400 whitespace-nowrap">{label}</span>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );
}
