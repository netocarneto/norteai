"use client";

import { AppShell } from "@/components/AppShell";
import { AIInput } from "@/components/AIInput";
import { ChartCard } from "@/components/ChartCard";
import { FinancialCard } from "@/components/FinancialCard";
import { MetricCard } from "@/components/MetricCard";
import { accountRows, metrics, transactions } from "@/lib/demo-data";

export function MoneyPage() {
  return (
    <AppShell activePath="/dinheiro">
      <div className="space-y-6">
        <section>
          <h1 className="page-title">Dinheiro</h1>
          <p className="page-subtitle">Fluxo mensal, contas e atividade recente.</p>
        </section>
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.slice(0, 2).map((metric) => <MetricCard key={metric.label} metric={metric} />)}
          {accountRows.slice(0, 2).map((row) => {
            const Icon = row.icon;
            return (
              <article key={row.label} className="metric-card">
                <div className="grid size-10 place-items-center rounded-xl bg-violet-50 text-violet-700">
                  <Icon size={20} aria-hidden="true" />
                </div>
                <p className="mt-4 text-sm font-medium text-slate-600">{row.label}</p>
                <p className="mt-2 text-2xl font-black text-slate-950">{row.value}</p>
              </article>
            );
          })}
        </section>
        <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
          <h2 className="section-title">Atividade recente</h2>
          <div className="mt-4 divide-y divide-slate-100">
            {transactions.map((transaction) => (
              <div key={transaction.merchant} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-black text-slate-950">{transaction.merchant}</p>
                  <p className="text-sm text-slate-500">{transaction.account} · {transaction.date}</p>
                </div>
                <p className={`font-black ${transaction.tone === "positive" ? "text-emerald-600" : "text-slate-950"}`}>{transaction.amount}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </AppShell>
  );
}

export function WealthPage() {
  return (
    <AppShell activePath="/patrimonio">
      <div className="space-y-6">
        <section>
          <h1 className="page-title">Patrimonio</h1>
          <p className="page-subtitle">Uma leitura limpa do teu patrimonio liquido.</p>
        </section>
        <FinancialCard />
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {accountRows.slice(2).map((row) => {
            const Icon = row.icon;
            return (
              <article key={row.label} className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
                <Icon size={22} className="text-violet-700" aria-hidden="true" />
                <p className="mt-4 text-sm font-bold text-slate-500">{row.label}</p>
                <p className="mt-2 text-3xl font-black text-slate-950">{row.value}</p>
              </article>
            );
          })}
        </section>
        <ChartCard />
      </div>
    </AppShell>
  );
}

export function NorteAIPage() {
  return (
    <AppShell activePath="/norteai">
      <div className="space-y-6">
        <section>
          <h1 className="page-title">NorteAI</h1>
          <p className="page-subtitle">Interface do assistente AI, sem ligacao real nesta fase.</p>
        </section>
        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <AIInput />
          <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
            <h2 className="section-title">Analise completa</h2>
            <div className="mt-5 space-y-4">
              {[
                "A reserva de emergencia esta acima do objetivo definido.",
                "Os restaurantes estao 28% acima da media dos ultimos 3 meses.",
                "A carteira tem exposicao elevada aos EUA atraves de ETFs globais e S&P500.",
                "Pode haver 320€/ano em poupanca de subscricoes pouco usadas.",
              ].map((item) => (
                <p key={item} className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">{item}</p>
              ))}
            </div>
          </article>
        </section>
      </div>
    </AppShell>
  );
}
