import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { allocation } from "@/lib/demo-data";

export function ChartCard() {
  return (
    <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
      <div className="flex items-center justify-between gap-4">
        <h2 className="section-title">Visao geral</h2>
        <button className="text-sm font-bold text-slate-500">Este mes</button>
      </div>
      <div className="mt-5 grid items-center gap-5 sm:grid-cols-[1fr_150px]">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-500">Receitas</p>
            <p className="font-black text-emerald-600">4.200,00€</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Despesas</p>
            <p className="font-black text-slate-700">2.780,00€</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Poupanca</p>
            <p className="font-black text-emerald-600">1.420,00€</p>
          </div>
        </div>
        <div className="relative mx-auto size-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={[{ value: 34 }, { value: 66 }]} dataKey="value" innerRadius={54} outerRadius={72} startAngle={90} endAngle={-270}>
                <Cell fill="#7c3aed" />
                <Cell fill="#ede9fe" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="text-2xl font-black text-slate-950">34%</p>
              <p className="text-xs text-slate-500">Taxa de poupanca</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-4 gap-2">
        {allocation.map((item) => (
          <div key={item.name} className="rounded-2xl bg-slate-50 p-3">
            <span className="block size-2 rounded-full" style={{ background: item.color }} />
            <p className="mt-2 text-xs font-bold text-slate-600">{item.name}</p>
            <p className="text-sm font-black text-slate-950">{item.value}%</p>
          </div>
        ))}
      </div>
    </article>
  );
}
