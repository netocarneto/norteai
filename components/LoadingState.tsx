export function LoadingState() {
  return (
    <div className="grid gap-4 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100" role="status">
      <div className="h-4 w-28 animate-pulse rounded-full bg-slate-200" />
      <div className="h-10 w-52 animate-pulse rounded-xl bg-slate-100" />
      <div className="grid grid-cols-3 gap-3">
        <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
        <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
        <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
      </div>
      <span className="sr-only">A carregar dados financeiros</span>
    </div>
  );
}
