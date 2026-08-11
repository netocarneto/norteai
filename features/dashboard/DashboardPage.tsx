"use client";

import type { ElementType } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowUpRight, ChevronRight, CircleDollarSign, Landmark, Lightbulb, PieChart as PieChartIcon, Target, TrendingUp, WalletCards } from "lucide-react";
import { AIInput } from "@/components/AIInput";
import { accountName, categoryName, euro, euroCents } from "@/lib/finance-engine";
import { useFinanceState } from "@/hooks/use-finance-state";

const wealthCurve = [
  { month: "Jan", value: 112000 },
  { month: "Fev", value: 148500 },
  { month: "Mar", value: 165000 },
  { month: "Abr", value: 201500 },
  { month: "Mai", value: 224000 },
  { month: "Jun", value: 0 },
];

export function DashboardPage() {
  const { state, summary, score } = useFinanceState();
  const chartCurve = wealthCurve.map((item) => (item.month === "Jun" ? { ...item, value: summary.netWorth } : item));
  const recent = [...state.transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const spendingCategories = summary.spendingCategories.length
    ? summary.spendingCategories
    : [{ name: "Sem dados", value: 1, color: "#e2e8f0" }];
  const incomeExpense = [
    { name: "Receitas", value: summary.income },
    { name: "Despesas", value: summary.expenses },
    { name: "Poupanca", value: Math.max(summary.savings, 0) },
  ];
  const scoreSparkline = [
    { label: "Poupanca", value: score.savingsRatePoints },
    { label: "Emergencia", value: score.emergencyFundPoints },
    { label: "Divida", value: score.debtRatioPoints },
    { label: "Diversificacao", value: score.diversificationPoints },
    { label: "Consistencia", value: score.consistencyPoints },
  ];
  const firstValue = chartCurve[0]?.value || summary.netWorth;
  const netWorthDelta = firstValue ? ((summary.netWorth - firstValue) / firstValue) * 100 : 0;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="page-title">Visao Geral</h1>
          <p className="page-subtitle">Bom dia, Diogo. A tua fotografia financeira de Stage 1.</p>
        </div>
        <a href="/movimentos" className="hidden rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white sm:inline-flex">
          Adicionar movimento
        </a>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100 xl:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-black text-slate-950">Norte Score</h2>
              <div className="mt-4 flex items-center gap-4">
                <ScoreDial score={score.score} />
                <div>
                  <p className="text-sm font-black text-emerald-600">{score.classification}</p>
                  <p className="mt-1 max-w-44 text-xs font-bold leading-5 text-slate-500">
                    Saude financeira calculada pelos teus registos.
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden h-24 min-w-40 flex-1 sm:block">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scoreSparkline}>
                  <Area dataKey="value" type="monotone" stroke="#6d28d9" strokeWidth={2.5} fill="#6d28d9" fillOpacity={0.08} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <SignalBars value={score.score} />
        </article>

        <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100 xl:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-black text-slate-950">Patrimonio liquido</h2>
              <p className="mt-5 text-4xl font-black leading-none tracking-normal text-[#071733] sm:text-5xl">
                {euro.format(summary.netWorth)}
              </p>
              <p className="mt-4 text-sm font-black text-teal-600">
                {netWorthDelta >= 0 ? "+" : ""}
                {netWorthDelta.toFixed(1)}% nos ultimos 6 meses
              </p>
            </div>
            <div className="grid size-16 place-items-center rounded-full bg-teal-50 text-teal-600">
              <TrendingUp size={30} strokeWidth={2.6} aria-hidden="true" />
            </div>
          </div>
        </article>
      </section>

      <article className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-slate-100 sm:p-5 xl:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-950">Evolucao patrimonial</h2>
          <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600" type="button">
            6M
          </button>
        </div>
        <div className="mt-4 h-64 sm:h-72 xl:h-[22rem]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartCurve} margin={{ left: 6, right: 10, top: 8, bottom: 0 }}>
              <CartesianGrid stroke="#edf1f7" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#7b8494", fontSize: 12, fontWeight: 700 }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#7b8494", fontSize: 12, fontWeight: 700 }}
                tickFormatter={(value) => `${Math.round(Number(value) / 1000)}K €`}
                width={56}
              />
              <Tooltip formatter={(value) => euro.format(Number(value))} />
              <Area dataKey="value" type="monotone" stroke="#6d28d9" strokeWidth={3} fill="#6d28d9" fillOpacity={0.12} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </article>

      <section className="grid gap-4 md:grid-cols-3">
        <InsightTile icon={Target} title="Estas no bom caminho." body={`A tua taxa de poupanca esta em ${summary.savingsRate}%.`} tone="violet" />
        <InsightTile icon={PieChartIcon} title="Diversificacao equilibrada." body="O teu portfolio esta bem distribuido." tone="teal" />
        <InsightTile icon={Lightbulb} title="Oportunidade detectada." body="Podes otimizar a tua alocacao de ativos." tone="violet" />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TopStat icon={WalletCards} label="Liquidez" value={euro.format(summary.cashPosition)} detail="Contas correntes e poupanca" tone="blue" />
        <TopStat icon={Landmark} label="Investimentos" value={euro.format(summary.investments)} detail="Carteira atual" tone="violet" />
        <TopStat icon={CircleDollarSign} label="Poupanca mensal" value={euro.format(summary.savings)} detail={`${summary.savingsRate}% das receitas`} tone="teal" />
        <TopStat icon={TrendingUp} label="Ativos" value={euro.format(summary.assets)} detail="Antes de passivos" tone="slate" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_1fr_0.95fr]">
        <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
          <h2 className="section-title">Receitas vs despesas</h2>
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
                  <Pie data={spendingCategories} dataKey="value" innerRadius={48} outerRadius={70}>
                    {spendingCategories.map((item) => <Cell key={item.name} fill={item.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {spendingCategories.slice(0, 4).map((item) => (
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

function ScoreDial({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(score, 100));
  const degrees = `${clamped * 3.6}deg`;

  return (
    <div
      className="grid size-24 shrink-0 place-items-center rounded-full"
      style={{ background: `conic-gradient(from -42deg, #6d28d9 0deg, #14b8a6 ${degrees}, #e7ebf1 ${degrees}, #e7ebf1 360deg)` }}
      aria-label={`Norte Score ${score} em 100`}
    >
      <div className="grid size-[4.7rem] place-items-center rounded-full bg-white">
        <span className="text-4xl font-black tracking-normal text-[#071733]">{score}</span>
      </div>
    </div>
  );
}

function SignalBars({ value }: { value: number }) {
  const activeBars = Math.round((Math.max(0, Math.min(value, 100)) / 100) * 18);

  return (
    <div className="mt-4 flex items-end gap-1.5" aria-hidden="true">
      {Array.from({ length: 18 }, (_, index) => (
        <span
          key={index}
          className={`h-4 w-1.5 rounded-full ${index < activeBars ? "bg-gradient-to-t from-violet-600 to-teal-400" : "bg-slate-100"}`}
        />
      ))}
    </div>
  );
}

function InsightTile({ icon: Icon, title, body, tone }: { icon: ElementType; title: string; body: string; tone: "violet" | "teal" }) {
  const toneClass = tone === "teal" ? "bg-teal-50 text-teal-600" : "bg-violet-50 text-violet-600";

  return (
    <article className="flex min-h-28 items-center gap-4 rounded-3xl bg-white p-4 shadow-soft ring-1 ring-slate-100">
      <div className={`grid size-14 shrink-0 place-items-center rounded-full ${toneClass}`}>
        <Icon size={28} strokeWidth={2.4} aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-black leading-5 text-slate-950">{title}</h3>
          <div className="flex shrink-0 items-center gap-2">
            <span className="rounded-full bg-amber-50 px-2 py-1 text-[0.62rem] font-black uppercase tracking-normal text-amber-700 ring-1 ring-amber-100">
              AI demo
            </span>
            <ChevronRight className="size-4 text-slate-400" aria-hidden="true" />
          </div>
        </div>
        <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">{body}</p>
      </div>
    </article>
  );
}

function TopStat({ icon: Icon, label, value, detail, tone }: { icon: ElementType; label: string; value: string; detail: string; tone: "blue" | "violet" | "teal" | "slate" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    violet: "bg-violet-50 text-violet-600",
    teal: "bg-teal-50 text-teal-600",
    slate: "bg-slate-100 text-slate-700",
  };

  return (
    <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
      <div className={`grid size-12 place-items-center rounded-2xl ${tones[tone]}`}>
        <Icon size={22} aria-hidden="true" />
      </div>
      <p className="mt-5 text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black leading-none tracking-normal text-slate-950">{value}</p>
      <p className="mt-3 text-xs font-bold text-slate-400">{detail}</p>
    </article>
  );
}
