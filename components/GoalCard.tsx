import { CalendarDays, CheckCircle2, Trash2 } from "lucide-react";
import type { FinancialGoalRecord } from "@/types/finance";

const euro = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

export function GoalCard({ goal, onDelete }: { goal: FinancialGoalRecord; onDelete?: () => void }) {
  const progress = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));

  return (
    <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-lg font-black text-slate-950">{goal.name}</p>
          <p className="mt-1 text-sm font-semibold text-slate-500">{goal.type}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">{goal.priority}</span>
          {onDelete ? (
            <button
              onClick={onDelete}
              className="grid size-9 place-items-center rounded-full bg-white text-slate-400 shadow-sm ring-1 ring-slate-200 hover:text-rose-600"
              aria-label={`Eliminar ${goal.name}`}
            >
              <Trash2 size={16} aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>
      <div className="mt-5">
        <div className="flex justify-between text-sm font-bold">
          <span>{euro.format(goal.currentValue)}</span>
          <span className="text-slate-500">{euro.format(goal.targetValue)}</span>
        </div>
        <div className="mt-3 h-3 rounded-full bg-slate-100">
          <div className="h-3 rounded-full bg-gradient-to-r from-teal-400 to-violet-600" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
        <span className="inline-flex items-center gap-2">
          <CalendarDays size={16} aria-hidden="true" />
          {goal.deadline}
        </span>
        <span className="inline-flex items-center gap-2 font-bold text-emerald-600">
          <CheckCircle2 size={16} aria-hidden="true" />
          {goal.status}
        </span>
      </div>
    </article>
  );
}
