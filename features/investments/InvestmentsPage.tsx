"use client";

import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Edit3, Plus, Trash2, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { confirmDeletion } from "@/lib/destructive-actions";
import { euro, investmentTypeLabels, investmentTypes } from "@/lib/finance-engine";
import { useFinanceState } from "@/hooks/use-finance-state";
import type { InvestmentRecord, InvestmentType } from "@/types/finance";

const emptyInvestment = {
  accountId: "",
  assetId: "asset-investments",
  ticker: "",
  name: "",
  type: "ETF" as InvestmentType,
  quantity: 0,
  averagePrice: 0,
  currentPrice: 0,
  currentValue: 0,
  costBasis: 0,
  source: "manual" as const,
  updatedAt: "2026-08-11T09:00:00.000Z",
  institution: "",
  currency: "EUR",
};

export function InvestmentsPage() {
  const { state, setState, summary, activeWorkspace } = useFinanceState();
  const [draft, setDraft] = useState<Omit<InvestmentRecord, "id" | "workspaceId">>(emptyInvestment);
  const [editingId, setEditingId] = useState<string | null>(null);
  const isFreelancer = activeWorkspace?.type === "FREELANCER";
  const portfolioCost = state.investments.reduce((total, investment) => total + investment.costBasis, 0);
  const portfolioValue = state.investments.reduce((total, investment) => total + investment.currentValue, 0);
  const portfolioGain = portfolioValue - portfolioCost;
  const portfolioGainRate = portfolioCost ? (portfolioGain / portfolioCost) * 100 : null;
  const latestUpdate = state.investments
    .map((investment) => investment.updatedAt)
    .filter(Boolean)
    .sort((a, b) => b.localeCompare(a))[0];

  function saveInvestment() {
    if (!draft.ticker || !draft.name || !activeWorkspace) return;
    const costBasis = draft.costBasis || draft.quantity * draft.averagePrice;
    const investment = { ...draft, costBasis, institution: draft.institution || "Manual", workspaceId: activeWorkspace.id, updatedAt: new Date().toISOString() };
    setState((current) => ({
      ...current,
      investments: editingId
        ? current.investments.map((item) => (item.id === editingId ? { ...investment, id: editingId } : item))
        : [...current.investments, { ...investment, id: `inv-${Date.now()}` }],
    }));
    setDraft(emptyInvestment);
    setEditingId(null);
  }

  function deleteInvestment(investment: InvestmentRecord) {
    if (!confirmDeletion(`${investment.ticker} · ${investment.name}`)) return;
    setState((current) => ({ ...current, investments: current.investments.filter((item) => item.id !== investment.id) }));
  }

  return (
    <AppShell activePath="/investimentos">
      <div className="space-y-6">
        <section>
          <h1 className="page-title">Investir</h1>
          <p className="page-subtitle">
            {isFreelancer ? "Investimentos da atividade, reservas investidas e capital profissional disponível." : "Carteira, posições, alocação, rentabilidade e concentração, sem recomendações de IA."}
          </p>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_1fr] xl:grid-cols-[1fr_1fr_0.9fr]">
          <article className="rounded-3xl bg-financial p-6 text-white shadow-purple">
            <p className="text-sm font-medium text-violet-100">{isFreelancer ? "Investimentos da atividade" : "Carteira total"}</p>
            <p className="mt-4 text-5xl font-black tracking-normal">{euro.format(summary.investments)}</p>
            <p className="mt-3 font-black text-emerald-200">{isFreelancer ? "Reservas investidas este mês" : "Contribuições este mês"}: {euro.format(summary.investmentContributions)}</p>
          </article>

          <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
            <h2 className="section-title">{isFreelancer ? "Alocação da atividade" : "Alocação"}</h2>
            {summary.allocation.length ? (
              <div className="mt-4 grid items-center gap-4 sm:grid-cols-[170px_1fr]">
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={summary.allocation} dataKey="value" innerRadius={50} outerRadius={78}>
                        {summary.allocation.map((item) => <Cell key={item.name} fill={item.color} />)}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {summary.allocation.map((item) => (
                    <div key={item.name} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                      <span className="flex items-center gap-2 text-sm font-bold text-slate-700"><span className="size-2.5 rounded-full" style={{ background: item.color }} />{item.name}</span>
                      <span className="font-black text-slate-950">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <EmptyState title="Sem alocação" description={isFreelancer ? "Cria posições da atividade para calcular a distribuição do capital profissional." : "Cria pelo menos uma posição para calcular a distribuição por classe de ativo."} />
              </div>
            )}
          </article>
          <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="section-title">{isFreelancer ? "Resumo profissional" : "Resumo da carteira"}</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {isFreelancer ? "Apenas posições registadas neste workspace profissional." : "Valores calculados pelas posições registadas."}
                </p>
              </div>
              <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-teal-50 text-teal-700">
                <TrendingUp size={20} aria-hidden="true" />
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              <SummaryRow label="Valor investido" value={euro.format(portfolioCost)} />
              <SummaryRow label="Valor atual" value={euro.format(portfolioValue)} />
              {isFreelancer ? <SummaryRow label="Mistura com pessoal" value="Não automática" /> : null}
              <SummaryRow
                label="Diferença estimada"
                value={`${portfolioGain >= 0 ? "+" : ""}${euro.format(portfolioGain)}${portfolioGainRate === null ? "" : ` · ${portfolioGainRate.toFixed(1)}%`}`}
                tone={portfolioGain >= 0 ? "positive" : "negative"}
              />
              <SummaryRow label="Última atualização" value={latestUpdate ? formatDate(latestUpdate) : "Sem registo"} />
            </div>
          </article>
        </section>

        <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
            <div className="flex items-center gap-2"><Plus size={20} className="text-violet-700" /><h2 className="section-title">{editingId ? "Editar posição" : (isFreelancer ? "Criar posição da atividade" : "Criar posição")}</h2></div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="form-field"><span>Ticker</span><input value={draft.ticker} onChange={(event) => setDraft({ ...draft, ticker: event.target.value.toUpperCase() })} placeholder={isFreelancer ? "RESERVA" : "VWCE"} /></label>
              <label className="form-field"><span>Nome</span><input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder={isFreelancer ? "Reserva investida da atividade" : "Vanguard FTSE All-World"} /></label>
              <label className="form-field"><span>Tipo</span><select value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value as InvestmentType })}>{investmentTypes.map((type) => <option key={type} value={type}>{investmentTypeLabels[type]}</option>)}</select></label>
              <label className="form-field"><span>Instituição</span><input value={draft.institution} onChange={(event) => setDraft({ ...draft, institution: event.target.value })} placeholder="Trade Republic" /></label>
              <label className="form-field"><span>Quantidade</span><input type="number" value={draft.quantity} onChange={(event) => setDraft({ ...draft, quantity: Number(event.target.value) })} /></label>
              <label className="form-field"><span>Preço médio</span><input type="number" value={draft.averagePrice} onChange={(event) => setDraft({ ...draft, averagePrice: Number(event.target.value) })} /></label>
              <label className="form-field"><span>Preço atual</span><input type="number" value={draft.currentPrice ?? 0} onChange={(event) => setDraft({ ...draft, currentPrice: Number(event.target.value) })} /></label>
              <label className="form-field"><span>Valor atual</span><input type="number" value={draft.currentValue} onChange={(event) => setDraft({ ...draft, currentValue: Number(event.target.value) })} /></label>
              <label className="form-field"><span>Custo total</span><input type="number" value={draft.costBasis} onChange={(event) => setDraft({ ...draft, costBasis: Number(event.target.value) })} /></label>
              <button className="primary-button sm:col-span-2" onClick={saveInvestment}>{editingId ? "Guardar posição" : (isFreelancer ? "Criar posição da atividade" : "Criar posição")}</button>
            </div>
          </article>

          <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
            <h2 className="section-title">{isFreelancer ? "Posições da atividade" : "Posições"}</h2>
            <div className="mt-4 divide-y divide-slate-100">
              {state.investments.length ? (
                state.investments.map((investment) => (
                  <div key={investment.id} className="flex flex-wrap items-center gap-3 py-4">
                    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-700"><TrendingUp size={18} /></div>
                    <div className="min-w-0 flex-1 basis-[13rem]">
                      <p className="truncate font-black text-slate-950">{investment.ticker} · {investment.name}</p>
                      <p className="truncate text-sm text-slate-500">{investmentTypeLabels[investment.type]} · {investment.quantity} unidades · PM {investment.averagePrice}</p>
                    </div>
                    <p className="shrink-0 font-black text-slate-950">{euro.format(investment.currentValue)}</p>
                    <div className="flex shrink-0 gap-2">
                      <button className="icon-button" onClick={() => {
                        setDraft({
                          assetId: investment.assetId,
                          ticker: investment.ticker,
                          name: investment.name,
                          type: investment.type,
                          quantity: investment.quantity,
                          averagePrice: investment.averagePrice,
                          currentPrice: investment.currentPrice,
                          currentValue: investment.currentValue,
                          costBasis: investment.costBasis,
                          source: investment.source,
                          updatedAt: investment.updatedAt,
                          institution: investment.institution,
                          currency: investment.currency,
                        });
                        setEditingId(investment.id);
                      }} aria-label="Editar"><Edit3 size={15} /></button>
                      <button className="icon-button" onClick={() => deleteInvestment(investment)} aria-label="Eliminar"><Trash2 size={15} /></button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4">
                  <EmptyState title="Sem posições" description={isFreelancer ? "Cria aplicações financeiras da atividade, reservas investidas ou capital profissional disponível." : "Cria ETFs, ações, cripto ou outros ativos para acompanhares a carteira."} />
                </div>
              )}
            </div>
          </article>
        </section>
      </div>
    </AppShell>
  );
}

function SummaryRow({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "positive" | "negative" | "neutral" }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
      <span className="text-sm font-bold text-slate-500">{label}</span>
      <span className={`text-sm font-black ${tone === "positive" ? "text-teal-700" : tone === "negative" ? "text-rose-600" : "text-slate-950"}`}>
        {value}
      </span>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value));
}
