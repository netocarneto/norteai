"use client";

import type { ElementType } from "react";
import Link from "next/link";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowUpRight, BriefcaseBusiness, CircleDollarSign, Clock3, Landmark, Lightbulb, PieChart as PieChartIcon, ReceiptText, Target, TrendingUp, UsersRound, WalletCards } from "lucide-react";
import { accountName, categoryName, defaultWorkspaceId, euro, euroCents } from "@/lib/finance-engine";
import { useFinanceState } from "@/hooks/use-finance-state";
import type { FinanceState, FinancialSummary, NorteScore } from "@/types/finance";

export function DashboardPage() {
  const { state, summary, score, activeWorkspace, setActiveWorkspace } = useFinanceState();
  if (activeWorkspace?.type === "FAMILY") return <FamilyDashboard state={state} summary={summary} score={score} onReturnToPersonal={() => setActiveWorkspace(defaultWorkspaceId)} />;
  if (activeWorkspace?.type === "FREELANCER") return <FutureWorkspaceDashboard icon={BriefcaseBusiness} title="NorteAI Freelancer" text="Esta área está preparada para atividade independente numa fase futura. Agora o foco é completar o NorteAI Pessoal." onReturnToPersonal={() => setActiveWorkspace(defaultWorkspaceId)} />;

  return <PersonalDashboard state={state} summary={summary} score={score} />;
}

function PersonalDashboard({ state, summary, score }: { state: FinanceState; summary: FinancialSummary; score: NorteScore }) {
  const hasData = hasWorkspaceData(state);
  if (!hasData) {
    return <WorkspaceEmptyState title="Visão Geral" text="Começa por adicionar a tua primeira conta." action="Adicionar conta" href="/dinheiro" />;
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
          <h1 className="page-title">Visão Geral</h1>
          <p className="page-subtitle">Bom dia, Diogo. A tua visão financeira atual.</p>
        </div>
        <a href="/movimentos" className="hidden rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white sm:inline-flex">
          Adicionar movimento
        </a>
      </section>

      <section className="grid gap-3 min-[390px]:grid-cols-2 lg:gap-5">
        <article className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-slate-100 sm:p-5 xl:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-sm font-black text-slate-950">Norte Score</h2>
              <div className="mt-3 flex items-center gap-3">
                <ScoreDial score={score.score} muted={!score.isDataSufficient} />
                <div className="min-w-0">
                  <p className="text-sm font-black text-emerald-600">{score.classification}</p>
                  <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
                    {score.reason ?? "A tua saúde financeira está muito boa."}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[0.72rem] font-semibold leading-5 text-slate-400">
                Baseado em poupança, fundo de emergência, dívida, diversificação e consistência.
              </p>
            </div>
          </div>
          <SignalBars value={score.score} muted={!score.isDataSufficient} />
          {score.isDataSufficient ? <ScoreBreakdown score={score} /> : null}
        </article>

        <article className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-slate-100 sm:p-5 xl:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-sm font-black text-slate-950">Património líquido</h2>
              <p className="mt-4 break-words text-3xl font-black leading-none tracking-normal text-[#071733] sm:text-5xl">
                {euro.format(summary.netWorth)}
              </p>
              <p className="mt-3 text-xs font-black leading-5 text-teal-600 sm:text-sm">
                {previousSnapshot ? `${absoluteChange >= 0 ? "+" : ""}${euro.format(absoluteChange)} · ${netWorthDelta !== null ? `${netWorthDelta >= 0 ? "+" : ""}${netWorthDelta.toFixed(1)}%` : "sem %"} desde o último snapshot` : "Histórico insuficiente"}
              </p>
            </div>
            <div className="grid size-12 shrink-0 place-items-center rounded-full bg-teal-50 text-teal-600 sm:size-16">
              <TrendingUp size={24} strokeWidth={2.6} aria-hidden="true" />
            </div>
          </div>
        </article>
      </section>

      <article className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-slate-100 sm:p-5 xl:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-950">Evolução patrimonial</h2>
          <span className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600">
            6M
          </span>
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
                <p className="font-black text-slate-950">Histórico insuficiente</p>
                <p className="mt-2 text-sm font-semibold text-slate-500">O gráfico só usa snapshots guardados. Nenhum valor histórico é inventado.</p>
              </div>
            </div>
          )}
        </div>
      </article>

      <section className="grid gap-4 md:grid-cols-3">
        <InsightTile icon={Target} title="Poupança mensal." body={summary.savingsRate === null ? "Ainda não há receitas suficientes para calcular a taxa." : `A tua taxa de poupança está em ${summary.savingsRate}%.`} tone="violet" />
        <InsightTile icon={PieChartIcon} title="Alocação calculada." body={summary.allocation.length ? "A carteira é calculada pelas posições registadas." : "Adiciona posições para calcular a alocação."} tone="teal" />
        <InsightTile icon={Lightbulb} title="Dados atualizados." body="A leitura depende das fontes e snapshots guardados." tone="violet" />
      </section>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
        <TopStat icon={WalletCards} label="Liquidez" value={euro.format(summary.cashPosition)} detail="Contas correntes e poupança" tone="blue" />
        <TopStat icon={Landmark} label="Investimentos" value={euro.format(summary.investments)} detail="Carteira atual" tone="violet" />
        <TopStat icon={CircleDollarSign} label="Poupança mensal" value={euro.format(summary.savings)} detail={summary.savingsRate === null ? "Sem receitas suficientes" : `${summary.savingsRate}% das receitas`} tone="teal" />
        <TopStat icon={TrendingUp} label="Ativos" value={euro.format(summary.assets)} detail="Antes de passivos" tone="slate" />
        <TopStat icon={Landmark} label="Passivos" value={euro.format(summary.liabilities)} detail="Dívidas registadas" tone="slate" />
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

function FamilyDashboard({ state, summary, score, onReturnToPersonal }: { state: FinanceState; summary: FinancialSummary; score: NorteScore; onReturnToPersonal: () => void }) {
  const hasData = hasWorkspaceData(state);
  if (!hasData) {
    return <WorkspaceEmptyState title="NorteAI Família" subtitle="Workspace familiar ativo." text="Adiciona uma conta partilhada para começar a visão familiar." action="Adicionar conta" href="/dinheiro" />;
  }

  const recent = [...state.transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="page-title">NorteAI Família</h1>
          <p className="page-subtitle">Visão partilhada do agregado, isolada do workspace Pessoal.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-violet-50 px-4 py-2 text-xs font-black uppercase tracking-normal text-violet-700 ring-1 ring-violet-100">
            MVP Família
          </span>
          <Link href="/" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white" onClick={onReturnToPersonal}>
            Voltar ao Pessoal
          </Link>
        </div>
      </section>

      <section className="grid gap-3 min-[390px]:grid-cols-2 lg:gap-5 xl:grid-cols-4">
        <TopStat icon={UsersRound} label="Património familiar" value={euro.format(summary.netWorth)} detail="Ativos menos passivos" tone="violet" />
        <TopStat icon={WalletCards} label="Liquidez partilhada" value={euro.format(summary.cashPosition)} detail="Contas familiares" tone="blue" />
        <TopStat icon={ReceiptText} label="Despesas do mês" value={euro.format(summary.expenses)} detail="Movimentos familiares" tone="slate" />
        <TopStat icon={CircleDollarSign} label="Poupança familiar" value={euro.format(summary.savings)} detail={summary.savingsRate === null ? "Sem receitas suficientes" : `${summary.savingsRate}% das receitas`} tone="teal" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
          <div className="flex items-center gap-2">
            <UsersRound size={20} className="text-violet-700" aria-hidden="true" />
            <h2 className="section-title">Membros e propriedade</h2>
          </div>
          <div className="mt-4 space-y-2">
            {state.workspaceMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-black text-slate-950">{member.name}</p>
                  <p className="text-xs font-bold text-slate-500">{member.role === "owner" ? "Responsável" : "Membro"}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-700 ring-1 ring-slate-200">
                  {member.ownershipPercentage ?? 0}%
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
          <div className="flex items-center gap-2">
            <WalletCards size={20} className="text-violet-700" aria-hidden="true" />
            <h2 className="section-title">Contas partilhadas</h2>
          </div>
          <div className="mt-4 space-y-2">
            {state.accounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-black text-slate-950">{account.name}</p>
                  <p className="truncate text-xs font-bold text-slate-500">{account.institution} · {account.ownershipType === "shared" ? "Partilhada" : "Pessoal"}</p>
                </div>
                <p className="shrink-0 font-black text-slate-950">{euro.format(account.balance)}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.95fr)]">
        <MonthlyReportCard state={state} summary={summary} />
        <RecentTransactionsCard state={state} recent={recent} />
        <div className="grid gap-5">
          <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
            <h2 className="section-title">Norte Score familiar</h2>
            <div className="mt-4 flex items-center gap-4">
              <ScoreDial score={score.score} muted={!score.isDataSufficient} />
              <div>
                <p className="font-black text-emerald-600">{score.classification}</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
                  Calculado por regras a partir dos dados familiares registados.
                </p>
              </div>
            </div>
            <SignalBars value={score.score} muted={!score.isDataSufficient} />
          </article>
          <DataFreshnessCard state={state} />
        </div>
      </section>
    </div>
  );
}

function FutureWorkspaceDashboard({ icon: Icon, title, text, onReturnToPersonal }: { icon: ElementType; title: string; text: string; onReturnToPersonal: () => void }) {
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
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">Os dados deste workspace continuam isolados. O produto completo desta área não está ativo nesta fase.</p>
          </div>
          <Link href="/" className="primary-button w-fit" onClick={onReturnToPersonal}>Voltar ao NorteAI Pessoal</Link>
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
    ["Poupança", score.savingsRatePoints, 30],
    ["Fundo de emergência", score.emergencyFundPoints, 20],
    ["Dívida", score.debtRatioPoints, 20],
    ["Diversificação", score.diversificationPoints, 20],
    ["Consistência", score.consistencyPoints, 10],
  ] as const;

  return (
    <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
      {rows.map(([label, value, total]) => (
        <div key={label} className="flex items-center justify-between rounded-xl bg-slate-50 px-2.5 py-1.5 text-[0.68rem] font-black sm:text-xs">
          <span className="text-slate-500">{label}</span>
          <span className="text-slate-950">{value}/{total}</span>
        </div>
      ))}
    </div>
  );
}

function DataFreshnessCard({ state }: { state: FinanceState }) {
  const hasCsvImports = state.transactions.some((transaction) => transaction.source === "csv");
  const sources = state.dataSources.filter((source) => source.type === "manual" || (source.type === "csv" && hasCsvImports && source.status !== "disconnected"));
  const updated = sources.filter((source) => source.status === "updated" || source.status === "connected").length;
  const completeness = sources.length ? Math.round((updated / sources.length) * 100) : 0;
  const needsUpdate = sources.length - updated;

  return (
    <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
      <div className="flex items-center gap-2">
        <Clock3 size={19} className="text-violet-700" aria-hidden="true" />
        <h2 className="section-title">Atualização dos dados</h2>
      </div>
      <p className="mt-4 text-3xl font-black text-slate-950">{completeness}%</p>
      <p className="mt-1 text-xs font-bold text-slate-500">{needsUpdate ? `${needsUpdate} fontes por atualizar` : "Fontes ativas atualizadas"}</p>
      <div className="mt-4 space-y-2">
        {sources.map((source) => (
          <div key={source.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs font-black">
            <span className="text-slate-700">{source.provider}</span>
            <span className={source.status === "updated" || source.status === "connected" ? "text-teal-600" : "text-amber-600"}>
              {source.status === "updated" || source.status === "connected" ? "Atualizado" : `Precisa de atualização${source.dataUntil ? ` desde ${source.dataUntil}` : ""}`}
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
        <h2 className="section-title">Análise financeira</h2>
      </div>
      <div className="mt-4 grid gap-2 text-sm font-bold text-slate-600">
        <ReportRow label="Maior categoria" value={mainCategory ? mainCategory.name : "Sem dados"} />
        <ReportRow label="Despesa principal" value={mainCategory ? euroCents.format(mainCategory.value) : "Sem dados"} />
        <ReportRow label="Poupança livre" value={euroCents.format(summary.savings)} />
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
        <ReportRow label="Poupança" value={euroCents.format(summary.savings)} />
        <ReportRow label="Taxa de poupança" value={summary.savingsRate === null ? "Dados insuficientes" : `${summary.savingsRate}%`} />
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
      className="grid size-20 shrink-0 place-items-center rounded-full sm:size-24"
      style={{ background: muted ? "#e7ebf1" : `conic-gradient(from -42deg, #6d28d9 0deg, #14b8a6 ${degrees}, #e7ebf1 ${degrees}, #e7ebf1 360deg)` }}
      aria-label={`Norte Score ${score} em 100`}
    >
      <div className="grid size-16 place-items-center rounded-full bg-white sm:size-[4.7rem]">
        <span className="text-3xl font-black tracking-normal text-[#071733] sm:text-4xl">{score}</span>
      </div>
    </div>
  );
}

function SignalBars({ value, muted = false }: { value: number; muted?: boolean }) {
  const activeBars = Math.round((Math.max(0, Math.min(value, 100)) / 100) * 18);

  return (
    <div className="mt-3 flex items-end gap-1" aria-hidden="true">
      {Array.from({ length: 18 }, (_, index) => (
        <span
          key={index}
          className={`h-3.5 w-1.5 rounded-full ${!muted && index < activeBars ? "bg-gradient-to-t from-violet-600 to-teal-400" : "bg-slate-100"}`}
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
              Análise financeira
            </span>
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
    <article className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-slate-100 sm:p-5">
      <div className={`grid size-11 place-items-center rounded-2xl sm:size-12 ${tones[tone]}`}>
        <Icon size={22} aria-hidden="true" />
      </div>
      <p className="mt-4 text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-2 break-words text-xl font-black leading-none tracking-normal text-slate-950 sm:text-2xl 2xl:text-3xl">{value}</p>
      <p className="mt-3 text-xs font-bold text-slate-400">{detail}</p>
    </article>
  );
}
