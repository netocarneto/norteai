import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { CreditCard, Landmark, TrendingUp, WalletCards } from "lucide-react";
import type { Metric } from "@/types/finance";

const toneMap = {
  blue: { bg: "bg-blue-50", text: "text-blue-700", stroke: "#2563eb", icon: CreditCard },
  green: { bg: "bg-emerald-50", text: "text-emerald-700", stroke: "#10b981", icon: Landmark },
  purple: { bg: "bg-violet-50", text: "text-violet-700", stroke: "#7c3aed", icon: TrendingUp },
  amber: { bg: "bg-amber-50", text: "text-amber-700", stroke: "#f59e0b", icon: WalletCards },
  rose: { bg: "bg-rose-50", text: "text-rose-700", stroke: "#e11d48", icon: CreditCard },
};

export function MetricCard({ metric }: { metric: Metric }) {
  const tone = toneMap[metric.tone];
  const Icon = tone.icon;
  const data = metric.trend.map((value, index) => ({ index, value }));

  return (
    <article className="metric-card">
      <div className="flex items-center justify-between gap-3">
        <div className={`grid size-10 place-items-center rounded-xl ${tone.bg} ${tone.text}`}>
          <Icon size={20} aria-hidden="true" />
        </div>
        <div className="h-12 w-20">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <Area dataKey="value" type="monotone" stroke={tone.stroke} strokeWidth={2} fill={tone.stroke} fillOpacity={0.08} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-600">{metric.label}</p>
      <p className="mt-2 text-2xl font-black tracking-normal text-slate-950">{metric.value}</p>
      <p className="mt-1 text-xs font-semibold text-slate-500">{metric.caption}</p>
    </article>
  );
}
