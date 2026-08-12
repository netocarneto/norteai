"use client";

import type { ElementType } from "react";
import Link from "next/link";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowUpRight, BriefcaseBusiness, ChevronRight, CircleDollarSign, Clock3, Landmark, Lightbulb, PieChart as PieChartIcon, ReceiptText, Target, TrendingUp, UsersRound, WalletCards } from "lucide-react";
import { accountName, categoryName, euro, euroCents } from "@/lib/finance-engine";
import { useFinanceState } from "@/hooks/use-finance-state";
import type { FinanceState, FinancialSummary, NorteScore } from "@/types/finance";

export function DashboardPage() {
  const { state, summary, score, activeWorkspace } = useFinanceState();
  if (activeWorkspace?.type === "FAMILY") return <FutureWorkspaceDashboard icon={UsersRound} title="NorteAI Familia" text="Esta area esta preparada para uma fase futura. Nesta fase estamos a finalizar o NorteAI Pessoal." />;
  if (activeWorkspace?.type === "FREELANCER") return <FutureWorkspaceDashboard icon={BriefcaseBusiness} title="NorteAI Freelancer" text="Esta area esta preparada para atividade independente numa fase futura. Agora o foco e completar o NorteAI Pessoal." />;

  return <PersonalDashboard state={state} summary={summary} score={score} />;
}

function PersonalDashboard({ state, summary, score }: { state: FinanceState; summary: FinancialSummary; score: NorteScore }) {
  const hasData = hasWorkspaceData(state);
  if (!hasData) {
    return <WorkspaceEmptyState title="Visao Geral" text="Comeca por adicionar a tua primeira conta." action="Adicionar conta" href="/dinheiro" />;
  }

  const chartCurve = buildWealthCurve(state, summary.netWorth);
  const hasHistory = chartCurve.length >= 2;
  const recent = [...state.transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const previousSnapshot = chartCurve.at(-2);
  const absoluteChange = previousSnapshot ? summary.netWorth - previousSnapshot.value : 0;
  const netWorthDelta = previousSnapshot?.value ? (absoluteChange / previousSnapshot.value) * 100 : null;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="page-title">Visao Geral</h1>
          <p className="page-subtitle">Bom dia, Diogo. A tua visao financeira atual.</p>
        </div>
        <a href="/movimentos" className="hidden rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white sm:inline-flex">
          Adicionar movimento
        </a>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100 xl:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-black text-slate-950">Norte Score</h2>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <ScoreDial score={score.score} muted={!score.isDataSufficient} />
                <div>
                  <p className="text-sm font-black text-emerald-600">{score.classification}</p>
                  <p className="mt-1 max-w-44 text-xs font-bold leading-5 text-slate-500">
                    {score.reason ?? "Calculado pelos teus dados financeiros."}
                  </p>
                </div>
              </div>
            </div>
            <ScoreStatusCard score={score} />
          </div>
          <SignalBars value={score.score} muted={!score.isDataSufficient} />
          {score.isDataSufficient ? <ScoreBreakdown score={score} /> : null}
        </article>

        <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100 xl:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-black text-slate-950">Patrimonio liquido</h2>
              <p className="mt-5 text-4xl font-black leading-none tracking-normal text-[#071733] sm:text-5xl">
                {euro.format(summary.netWorth)}
              </p>
              <p className="mt-4 text-sm font-black text-teal-600">
                {previousSnapshot ? `${absoluteChange >= 0 ? "+" : ""}${euro.format(absoluteChange)} · ${netWorthDelta !== null ? `${netWorthDelta >= 0 ? "+" : ""}${netWorthDelta.toFixed(1)}%` : "sem %"} desde o ultimo snapshot` : "Historico insuficiente"}
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
          {hasHistory ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartCurve} margin={{ left: 6, right: 10, top: 8, bottom: 0 }}>
                <CartesianGrid stroke="#edf1f7" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#7b8494", fontSize: 12, fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#7b8494", fontSize: 12, fontWeight: 700 }} tickFormatter={(value) => `${Math.round(Number(value) / 1000)}K €`} width={56} />
                <Tooltip formatter={(value) => euro.format(Number(value))} />
                <Area dataKey="value" type="monotone" stroke="#6d28d9" strokeWidth={3} fill="#6d28d9" fillOpacity={0.12} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="grid h-full place-items-center rounded-2xl bg-slate-50 text-center">
              <div>
                <p className="font-black text-slate-950">Historico insuficiente</p>
                <p className="mt-2 text-sm font-semibold text-slate-500">O grafico so usa snapshots guardados. Nenhum valor historico e inventado.</p>
              </div>
            </div>
          )}
        </div>
      </article>

      <section className="grid gap-4 md:grid-cols-3">
        <InsightTile icon={Target} title="Poupanca mensal." body={summary.savingsRate === null ? "Ainda nao ha receitas suficientes para calcular a taxa." : `A tua taxa de poupanca esta em ${summary.savingsRate}%.`} tone="violet" />
        <InsightTile icon={PieChartIcon} title="Alocacao calculada." body={summary.allocation.length ? "A carteira e calculada pelas posicoes registadas." : "Adiciona posicoes para calcular a alocacao."} tone="teal" />
        <InsightTile icon={Lightbulb} title="Dados atualizados." body="A leitura depende das fontes e snapshots guardados." tone="violet" />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <TopStat icon={WalletCards} label="Liquidez" value={euro.format(summary.cashPosition)} detail="Contas correntes e poupanca" tone="blue" />
        <TopStat icon={Landmark} label="Investimentos" value={euro.format(summary.investments)} detail="Carteira atual" tone="violet" />
        <TopStat icon={CircleDollarSign} label="Poupanca mensal" value={euro.format(summary.savings)} detail={summary.savingsRate === null ? "Sem receitas suficientes" : `${summary.savingsRate}% das receitas`} tone="teal" />
        <TopStat icon={TrendingUp} label="Ativos" value={euro.format(summary.assets)} detail="Antes de passivos" tone="slate" />
        <TopStat icon={Landmark} label="Passivos" value={euro.format(summary.liabilities)} detail="Dividas registadas" tone="slate" />
      </section>

      <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.95fr)]">
        <MonthlyReportCard state={state} summary={summary} />
        <RecentTransactionsCard state={state} recent={recent} />
        <div className="grid gap-5">
          <DataFreshnessCard state={state} />
          <AnalysisCard summary={summary} />
        </div>
      </section>
    </div>
  );
}

function FutureWorkspaceDashboard({ icon: Icon, title, text }: { icon: ElementType; title: string; text: string }) {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{text}</p>
      </section>
      <article className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-100 sm:p-8">
        <div className="grid max-w-xl gap-4">
          <div className="grid size-14 place-items-center rounded-2xl bg-violet-50 text-violet-700">
            <Icon size={26} aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-950">Preparado para uma fase futura</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">Os dados deste workspace continuam isolados. O produto completo desta area nao esta ativo nesta fase.</p>
          </div>
          <Link href="/" className="primary-button w-fit">Voltar ao NorteAI Pessoal</Link>
        </div>
      </article>
    </div>
  );
}

function WorkspaceEmptyState({ title, subtitle, text, action, href }: { title: string; subtitle?: string; text: string; action: string; href: string }) {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="page-title">{title}</h1>
        {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
      </section>
      <article className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-100 sm:p-8">
        <div className="grid max-w-xl gap-4">
          <div className="grid size-14 place-items-center rounded-2xl bg-violet-50 text-violet-700">
            <WalletCards size={26} aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-950">Sem dados suficientes</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{text}</p>
          </div>
          <a href={href} className="primary-button w-fit">{action}</a>
        </div>
      </article>
    </div>
  );
}

function hasWorkspaceData(state: FinanceState) {
  return Boolean(state.accounts.length || state.transactions.length || state.assets.length || state.liabilities.length || state.investments.length || state.financialGoals.length);
}

function buildWealthCurve(state: FinanceState, netWorth: number) {
  const snapshots = state.financialSnapshots.map((snapshot) => ({ month: snapshot.month, value: snapshot.netWorth }));

  return [...snapshots.slice(-5), { month: "Atual", value: netWorth }];
}

function ScoreBreakdown({ score }: { score: NorteScore }) {
  const rows = [
    ["Poupanca", score.savingsRatePoints, 30],
    ["Fundo de emergencia", score.emergencyFundPoints, 20],
    ["Divida", score.debtRatioPoints, 20],
    ["Diversificacao", score.diversificationPoints, 20],
    ["Consistencia", score.consistencyPoints, 10],
  ] as const;

  return (
    <div className="mt-4 grid gap-2 sm:grid-cols-2">
      {rows.map(([label, value, total]) => (
        <div key={label} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs font-black">
          <span className="text-slate-500">{label}</span>
          <span className="text-slate-950">{value}/{total}</span>
        </div>
      ))}
    </div>
  );
}

function ScoreStatusCard({ score }: { score: NorteScore }) {
  return (
    <div className="hidden min-w-40 rounded-2xl bg-slate-50 p-4 sm:block">
      <p className="text-xs font-black uppercase tracking-normal text-slate-400">Estado</p>
      <p className="mt-2 text-lg font-black text-slate-950">{score.isDataSufficient ? "Calculado" : "Incompleto"}</p>
      <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
        {score.isDataSufficient ? "Baseado em regras financeiras." : "Adiciona receitas e despesas."}
      </p>
    </div>
  );
}

function DataFreshnessCard({ state }: { state: FinanceState }) {
  const sources = state.dataSources.filter((source) => ["manual", "csv"].includes(source.type));
  const updated = sources.filter((source) => source.status === "updated" || source.status === "connected").length;
  const completeness = sources.length ? Math.round((updated / sources.length) * 100) : 0;
  const needsUpdate = sources.length - updated;

  return (
    <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
      <div className="flex items-center gap-2">
        <Clock3 size={19} className="text-violet-700" aria-hidden="true" />
        <h2 className="section-title">Atualizacao dos dados</h2>
      </div>
      <p className="mt-4 text-3xl font-black text-slate-950">{completeness}%</p>
      <p className="mt-1 text-xs font-bold text-slate-500">{needsUpdate} fontes por atualizar</p>
      <div className="mt-4 space-y-2">
        {sources.map((source) => (
          <div key={source.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs font-black">
            <span className="text-slate-700">{source.provider}</span>
            <span className={source.status === "updated" || source.status === "connected" ? "text-teal-600" : "text-amber-600"}>
              {source.status === "updated" || source.status === "connected" ? "Atualizado" : `Precisa de atualizacao${source.dataUntil ? ` desde ${source.dataUntil}` : ""}`}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}

function RecentTransactionsCard({ state, recent }: { state: FinanceState; recent: FinanceState["transactions"] }) {
  return (
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
              <p className="truncate text-xs text-slate-500">{accountName(state, transaction.accountId)} · {categoryName(state, transaction.categoryId)}</p>
            </div>
            <p className={`shrink-0 font-black ${transaction.amount > 0 ? "text-emerald-600" : "text-slate-950"}`}>{euroCents.format(transaction.amount)}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

function AnalysisCard({ summary }: { summary: FinancialSummary }) {
  const mainCategory = summary.spendingCategories[0];

  return (
    <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
      <div className="flex items-center gap-2">
        <Lightbulb size={19} className="text-violet-700" aria-hidden="true" />
        <h2 className="section-title">Analise financeira</h2>
      </div>
      <div className="mt-4 grid gap-2 text-sm font-bold text-slate-600">
        <ReportRow label="Maior categoria" value={mainCategory ? mainCategory.name : "Sem dados"} />
        <ReportRow label="Despesa principal" value={mainCategory ? euroCents.format(mainCategory.value) : "Sem dados"} />
        <ReportRow label="Poupanca livre" value={euroCents.format(summary.savings)} />
      </div>
    </article>
  );
}

function MonthlyReportCard({ state, summary }: { state: FinanceState; summary: FinancialSummary }) {
  const expensesByCategory = summary.spendingCategories.slice(0, 3);
  const invested = Math.abs(state.transactions.filter((transaction) => transaction.type === "investment").reduce((total, transaction) => total + transaction.amount, 0));

  return (
    <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
      <div className="flex items-center gap-2">
        <ReceiptText size={19} className="text-violet-700" aria-hidden="true" />
        <h2 className="section-title">Resumo mensal</h2>
      </div>
      <div className="mt-4 grid gap-2 text-sm font-bold text-slate-600">
        <ReportRow label="Receitas" value={euroCents.format(summary.income)} />
        <ReportRow label="Despesas" value={euroCents.format(summary.expenses)} />
        <ReportRow label="Poupanca" value={euroCents.format(summary.savings)} />
        <ReportRow label="Taxa de poupanca" value={summary.savingsRate === null ? "Dados insuficientes" : `${summary.savingsRate}%`} />
        <ReportRow label="Investido" value={euroCents.format(invested)} />
      </div>
      <div className="mt-4 space-y-2">
        {expensesByCategory.map((category) => (
          <ReportRow key={category.name} label={category.name} value={euroCents.format(category.value)} />
        ))}
      </div>
    </article>
  );
}

function ReportRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
      <span>{label}</span>
      <span className="font-black text-slate-950">{value}</span>
    </div>
  );
}

function ScoreDial({ score, muted = false }: { score: number; muted?: boolean }) {
  const clamped = Math.max(0, Math.min(score, 100));
  const degrees = `${clamped * 3.6}deg`;

  return (
    <div
      className="grid size-24 shrink-0 place-items-center rounded-full"
      style={{ background: muted ? "#e7ebf1" : `conic-gradient(from -42deg, #6d28d9 0deg, #14b8a6 ${degrees}, #e7ebf1 ${degrees}, #e7ebf1 360deg)` }}
      aria-label={`Norte Score ${score} em 100`}
    >
      <div className="grid size-[4.7rem] place-items-center rounded-full bg-white">
        <span className="text-4xl font-black tracking-normal text-[#071733]">{score}</span>
      </div>
    </div>
  );
}

function SignalBars({ value, muted = false }: { value: number; muted?: boolean }) {
  const activeBars = Math.round((Math.max(0, Math.min(value, 100)) / 100) * 18);

  return (
    <div className="mt-4 flex items-end gap-1.5" aria-hidden="true">
      {Array.from({ length: 18 }, (_, index) => (
        <span
          key={index}
          className={`h-4 w-1.5 rounded-full ${!muted && index < activeBars ? "bg-gradient-to-t from-violet-600 to-teal-400" : "bg-slate-100"}`}
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
            <span className="rounded-full bg-violet-50 px-2 py-1 text-[0.62rem] font-black uppercase tracking-normal text-violet-700 ring-1 ring-violet-100">
              Analise financeira
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
      <p className="mt-2 text-2xl font-black leading-none tracking-normal text-slate-950 2xl:text-3xl">{value}</p>
      <p className="mt-3 text-xs font-bold text-slate-400">{detail}</p>
    </article>
  );
}
