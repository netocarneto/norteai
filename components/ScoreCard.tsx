import { Info, TrendingUp } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";

export function ScoreCard() {
  return (
    <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <span>Norte Score</span>
          <Info size={16} className="text-slate-400" aria-hidden="true" />
        </div>
        <div className="flex gap-1">
          <span className="size-1.5 rounded-full bg-violet-600" />
          <span className="size-1.5 rounded-full bg-teal-400" />
          <span className="size-1.5 rounded-full bg-slate-300" />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-[1fr_auto] items-center gap-4">
        <div>
          <p className="text-5xl font-black tracking-normal text-slate-950">
            84 <span className="text-lg font-semibold text-slate-500">/100</span>
          </p>
          <p className="mt-3 font-bold text-emerald-600">Muito bom</p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-700">
            <TrendingUp size={15} aria-hidden="true" />
            +2 este mes
          </p>
        </div>
        <div className="relative grid size-28 place-items-center rounded-full bg-[conic-gradient(from_120deg,#14b8a6_0_28%,#ede9fe_28%_42%,#6d28d9_42%_84%,#e2e8f0_84%_100%)] p-3 sm:size-32">
          <div className="grid size-full place-items-center rounded-full bg-white shadow-inner">
            <BrandMark compact />
          </div>
        </div>
      </div>
    </article>
  );
}
