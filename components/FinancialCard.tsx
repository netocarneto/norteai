import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { wealthCurve } from "@/lib/demo-data";

export function FinancialCard() {
  return (
    <article className="overflow-hidden rounded-3xl bg-financial p-5 text-white shadow-purple sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-violet-100">Patrimonio liquido</p>
          <p className="mt-4 text-4xl font-black tracking-normal sm:text-5xl">245.230€</p>
          <p className="mt-3 text-sm font-bold text-emerald-200">+ 8,2% este ano</p>
        </div>
        <button className="rounded-full bg-white/14 px-3 py-1.5 text-xs font-bold text-white ring-1 ring-white/20" aria-label="Alterar intervalo">
          12M
        </button>
      </div>
      <div className="mt-4 h-44 sm:h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={wealthCurve} margin={{ left: 0, right: 6, top: 18, bottom: 0 }}>
            <defs>
              <linearGradient id="wealth" x1="0" x2="0" y1="0" y2="1">
                <stop offset="10%" stopColor="#ffffff" stopOpacity={0.36} />
                <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.14)" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.74)", fontSize: 12 }} />
            <YAxis hide domain={["dataMin - 8000", "dataMax + 6000"]} />
            <Tooltip
              cursor={{ stroke: "rgba(255,255,255,0.45)" }}
              contentStyle={{ border: 0, borderRadius: 14, background: "rgba(15,23,42,0.92)", color: "white" }}
              formatter={(value) => [`${Number(value).toLocaleString("pt-PT")}€`, "Patrimonio"]}
            />
            <Area dataKey="value" type="monotone" stroke="#ffffff" strokeWidth={2.5} fill="url(#wealth)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
