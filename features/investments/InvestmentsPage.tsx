"use client";

import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { AppShell } from "@/components/AppShell";
import { AIInput } from "@/components/AIInput";
import { allocation, positions } from "@/lib/demo-data";

const euro = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

export function InvestmentsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <section>
          <h1 className="page-title">Investimentos</h1>
          <p className="page-subtitle">Carteira, alocacao e sinais de risco para decisoes melhores.</p>
        </section>
        <section className="grid gap-5 lg:grid-cols-[1fr_1fr] xl:grid-cols-[1fr_1fr_0.9fr]">
          <article className="rounded-3xl bg-financial p-6 text-white shadow-purple">
            <p className="text-sm font-medium text-violet-100">Portfolio value</p>
            <p className="mt-4 text-5xl font-black tracking-normal">96.350€</p>
            <p className="mt-3 font-black text-emerald-200">+6,7% performance</p>
          </article>
          <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
            <h2 className="section-title">Allocation</h2>
            <div className="mt-4 grid items-center gap-4 sm:grid-cols-[170px_1fr]">
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={allocation} dataKey="value" innerRadius={50} outerRadius={78}>
                      {allocation.map((item) => <Cell key={item.name} fill={item.color} />)}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {allocation.map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <span className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <span className="size-2.5 rounded-full" style={{ background: item.color }} />
                      {item.name}
                    </span>
                    <span className="font-black text-slate-950">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </article>
          <AIInput compact />
        </section>
        <section className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
          <h2 className="section-title">Positions</h2>
          <div className="mt-4 grid gap-3">
            {positions.map((position) => (
              <article key={position.name} className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-black text-slate-950">{position.name}</p>
                  <p className="text-sm text-slate-500">{position.type}</p>
                </div>
                <div className="flex items-center justify-between gap-6 sm:text-right">
                  <p className="font-black text-slate-950">{euro.format(position.value)}</p>
                  <p className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-700">{position.performance}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
