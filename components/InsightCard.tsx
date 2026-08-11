import { ChevronRight } from "lucide-react";
import type { Insight } from "@/types/finance";

const toneMap = {
  blue: "bg-blue-50 text-blue-700",
  green: "bg-emerald-50 text-emerald-700",
  purple: "bg-violet-50 text-violet-700",
  amber: "bg-amber-50 text-amber-700",
  rose: "bg-rose-50 text-rose-700",
};

export function InsightCard({ insight }: { insight: Insight }) {
  const Icon = insight.icon;

  return (
    <article className="flex items-center gap-4 border-b border-slate-100 py-4 last:border-0">
      <div className={`grid size-12 shrink-0 place-items-center rounded-2xl ${toneMap[insight.tone]}`}>
        <Icon size={22} aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-slate-950">{insight.title}</p>
        <p className="mt-1 text-sm leading-5 text-slate-600">{insight.description}</p>
      </div>
      <ChevronRight size={18} className="text-slate-400" aria-hidden="true" />
    </article>
  );
}
