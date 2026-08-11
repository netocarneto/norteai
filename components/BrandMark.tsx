export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid size-9 place-items-center rounded-full bg-white shadow-soft ring-1 ring-slate-200">
        <span className="absolute h-7 w-0.5 rounded-full bg-violet-600" />
        <span className="absolute h-7 w-0.5 rotate-90 rounded-full bg-teal-500" />
        <span className="absolute size-5 rotate-45 rounded-[4px] border-2 border-violet-500" />
      </div>
      {!compact && <span className="text-xl font-black tracking-normal text-slate-950">NorteAI</span>}
    </div>
  );
}
