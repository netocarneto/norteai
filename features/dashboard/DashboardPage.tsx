"use client";

import { ArrowUpRight, Sparkles } from "lucide-react";
import { AIInput } from "@/components/AIInput";
import { ChartCard } from "@/components/ChartCard";
import { FinancialCard } from "@/components/FinancialCard";
import { InsightCard } from "@/components/InsightCard";
import { MetricCard } from "@/components/MetricCard";
import { ScoreCard } from "@/components/ScoreCard";
import { insights, metrics, transactions } from "@/lib/demo-data";

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="page-title">Bom dia, Diogo 👋</h1>
          <p className="page-subtitle">O teu copiloto financeiro inteligente.</p>
        </div>
        <a href="/norteai" className="hidden rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white sm:inline-flex">
          Abrir NorteAI
        </a>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_1.45fr] xl:grid-cols-[1fr_1.45fr_1fr]">
        <ScoreCard />
        <FinancialCard />
        <aside className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100 lg:col-span-2 xl:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="section-title">O teu Norte hoje</h2>
            <a href="/norteai" className="text-sm font-bold text-violet-700">Ver todas</a>
          </div>
          <div className="mt-3">
            {insights.map((insight) => (
              <InsightCard key={insight.title} insight={insight} />
            ))}
          </div>
        </aside>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_1fr] xl:grid-cols-[1.1fr_1fr_1fr]">
        <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Atividade recente</h2>
            <a href="/money" className="text-sm font-bold text-violet-700">Ver todas</a>
          </div>
          <div className="mt-4 space-y-1">
            {transactions.map((transaction) => (
              <div key={`${transaction.merchant}-${transaction.date}`} className="flex items-center gap-3 rounded-2xl px-2 py-3 transition hover:bg-slate-50">
                <div className="grid size-10 place-items-center rounded-xl bg-slate-100 text-slate-600">
                  <ArrowUpRight size={18} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-slate-950">{transaction.merchant}</p>
                  <p className="text-sm text-slate-500">{transaction.account}</p>
                </div>
                <div className="text-right">
                  <p className={`font-black ${transaction.tone === "positive" ? "text-emerald-600" : "text-slate-950"}`}>{transaction.amount}</p>
                  <p className="text-xs text-slate-500">{transaction.date}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
        <ChartCard />
        <div className="space-y-5 lg:col-span-2 xl:col-span-1">
          <AIInput compact />
          <article className="rounded-3xl bg-slate-950 p-5 text-white shadow-soft">
            <div className="flex items-center gap-2 text-violet-200">
              <Sparkles size={18} aria-hidden="true" />
              <span className="text-sm font-black">Proxima oportunidade</span>
            </div>
            <p className="mt-4 text-2xl font-black tracking-normal">Aumentar o investimento mensal em 220€</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Mantendo a tua reserva, podes acelerar o objetivo casa sem pressionar liquidez.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
