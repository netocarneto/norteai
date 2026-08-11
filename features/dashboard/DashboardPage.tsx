"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowUpRight, Landmark, PiggyBank, WalletCards } from "lucide-react";
import { AIInput } from "@/components/AIInput";
import { accountName, categoryName, euro, euroCents } from "@/lib/finance-engine";
import { useFinanceState } from "@/hooks/use-finance-state";

const wealthCurve = [
  { month: "Mar", value: 214000 },
  { month: "Abr", value: 219800 },
  { month: "Mai", value: 225200 },
  { month: "Jun", value: 230100 },
  { month: "Jul", value: 236800 },
  { month: "Ago", value: 0 },
];

export function DashboardPage() {
  const { state, summary, score } = useFinanceState();
  const chartCurve = wealthCurve.map((item) => (item.month === "Ago" ? { ...item, value: summary.netWorth } : item));
  const recent = [...state.transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const incomeExpense = [
    { name: "Income", value: summary.income },
    { name: "Expenses", value: summary.expenses },
    { name: "Savings", value: Math.max(summary.savings, 0) },
  ];

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="page-title">Bom dia, Diogo 👋</h1>
          <p className="page-subtitle">Dados reais de Stage 1 calculados pelo motor financeiro.</p>
        </div>
        <a href="/movimentos" className="hidden rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white sm:inline-flex">
          Adicionar movimento
        </a>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.5fr] xl:grid-cols-[0.9fr_1.5fr_1fr]">
        <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100 sm:p-6">
          <p className="text-sm font-bold text-slate-500">Norte Score v1</p>
          <p className="mt-4 text-5xl font-black text-slate-950">{score.score}<span className="text-lg text-slate-500">/100</span></p>
          <p className="mt-2 font-black text-emerald-600">{score.classification}</p>
          <div className="mt-5 space-y-2 text-xs font-bold text-slate-500">
            <ScoreLine label="Poupanca" value={score.savingsRatePoints} max={30} />
            <ScoreLine label="Emergencia" value={score.emergencyFundPoints} max={20} />
            <ScoreLine label="Divida" value={score.debtRatioPoints} max={20} />
            <ScoreLine label="Diversificacao" value={score.diversificationPoints} max={20} />
          </div>
        </article>

        <article className="overflow-hidden rounded-3xl bg-financial p-5 text-white shadow-purple sm:p-6">
          <p className="text-sm font-medium text-violet-100">Patrimonio liquido</p>
          <p className="mt-4 text-4xl font-black tracking-normal sm:text-5xl">{euro.format(summary.netWorth)}</p>
          <p className="mt-2 text-sm font-bold text-emerald-200">Ativos - passivos, atualizado pelos teus registos</p>
          <div className="mt-4 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartCurve}>
                <CartesianGrid stroke="rgba(255,255,255,0.16)" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.72)", fontSize: 12 }} />
                <YAxis hide />
                <Tooltip formatter={(value) => euro.format(Number(value))} />
                <Area dataKey="value" type="monotone" stroke="#ffffff" strokeWidth={2.5} fill="#ffffff" fillOpacity={0.18} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <aside className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100 lg:col-span-2 xl:col-span-1">
          <h2 className="section-title">Resumo Agosto 2026</h2>
          <div className="mt-5 space-y-3">
            <MetricRow icon={WalletCards} label="Cash" value={euro.format(summary.cashPosition)} />
            <MetricRow icon={Landmark} label="Investimentos" value={euro.format(summary.investments)} />
            <MetricRow icon={PiggyBank} label="Poupanca mensal" value={`${euro.format(summary.savings)} · ${summary.savingsRate}%`} />
          </div>
        </aside>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Receitas", summary.income, "text-emerald-600"],
          ["Despesas", summary.expenses, "text-rose-600"],
          ["Ativos", summary.assets, "text-violet-700"],
          ["Dividas", summary.liabilities, "text-slate-950"],
        ].map(([label, value, color]) => (
          <article key={label} className="metric-card">
            <p className="text-sm font-bold text-slate-500">{label}</p>
            <p className={`mt-4 text-3xl font-black ${color}`}>{euro.format(Number(value))}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_1fr_0.9fr]">
        <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
          <h2 className="section-title">Income vs expenses</h2>
          <div className="mt-5 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeExpense}>
                <CartesianGrid stroke="#eef2f7" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip formatter={(value) => euro.format(Number(value))} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {incomeExpense.map((item, index) => <Cell key={item.name} fill={["#10b981", "#e11d48", "#6d28d9"][index]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
          <h2 className="section-title">Categorias de despesa</h2>
          <div className="mt-5 grid items-center gap-4 sm:grid-cols-[150px_1fr]">
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={summary.spendingCategories} dataKey="value" innerRadius={48} outerRadius={70}>
                    {summary.spendingCategories.map((item) => <Cell key={item.name} fill={item.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {summary.spendingCategories.slice(0, 4).map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
                  <span className="font-bold text-slate-600">{item.name}</span>
                  <span className="font-black text-slate-950">{euroCents.format(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </article>

        <div className="space-y-5">
          <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="section-title">Movimentos recentes</h2>
              <a href="/movimentos" className="text-sm font-bold text-violet-700">Ver todos</a>
            </div>
            <div className="mt-4 space-y-2">
              {recent.map((transaction) => (
                <div key={transaction.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                  <ArrowUpRight size={18} className={transaction.amount > 0 ? "text-emerald-600" : "text-slate-400"} aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-black text-slate-950">{transaction.merchant}</p>
                    <p className="text-xs text-slate-500">{accountName(state, transaction.accountId)} · {categoryName(state, transaction.categoryId)}</p>
                  </div>
                  <p className={`font-black ${transaction.amount > 0 ? "text-emerald-600" : "text-slate-950"}`}>{euroCents.format(transaction.amount)}</p>
                </div>
              ))}
            </div>
          </article>
          <AIInput compact />
        </div>
      </section>
    </div>
  );
}

function ScoreLine({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div>
      <div className="flex justify-between">
        <span>{label}</span>
        <span>{value}/{max}</span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-violet-600" style={{ width: `${(value / max) * 100}%` }} />
      </div>
    </div>
  );
}

function MetricRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
      <div className="grid size-10 place-items-center rounded-xl bg-violet-50 text-violet-700">
        <Icon size={19} aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-500">{label}</p>
        <p className="font-black text-slate-950">{value}</p>
      </div>
    </div>
  );
}
