"use client";

import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Edit3, Plus, Trash2, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AIInput } from "@/components/AIInput";
import { euro, investmentTypeLabels, investmentTypes } from "@/lib/finance-engine";
import { useFinanceState } from "@/hooks/use-finance-state";
import type { InvestmentRecord, InvestmentType } from "@/types/finance";

const emptyInvestment = {
  assetId: "asset-investments",
  ticker: "",
  name: "",
  type: "ETF" as InvestmentType,
  quantity: 0,
  averagePrice: 0,
  currentValue: 0,
  currency: "EUR",
};

export function InvestmentsPage() {
  const { state, setState, summary } = useFinanceState();
  const [draft, setDraft] = useState<Omit<InvestmentRecord, "id">>(emptyInvestment);
  const [editingId, setEditingId] = useState<string | null>(null);

  function saveInvestment() {
    if (!draft.ticker || !draft.name) return;
    setState((current) => ({
      ...current,
      investments: editingId
        ? current.investments.map((item) => (item.id === editingId ? { ...draft, id: editingId } : item))
        : [...current.investments, { ...draft, id: `inv-${Date.now()}` }],
    }));
    setDraft(emptyInvestment);
    setEditingId(null);
  }

  return (
    <AppShell activePath="/investimentos">
      <div className="space-y-6">
        <section>
          <h1 className="page-title">Investimentos</h1>
          <p className="page-subtitle">Acompanhamento manual de posicoes, alocacao e contribuicoes.</p>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_1fr] xl:grid-cols-[1fr_1fr_0.9fr]">
          <article className="rounded-3xl bg-financial p-6 text-white shadow-purple">
            <p className="text-sm font-medium text-violet-100">Carteira total</p>
            <p className="mt-4 text-5xl font-black tracking-normal">{euro.format(summary.investments)}</p>
            <p className="mt-3 font-black text-emerald-200">Contribuicoes este mes: {euro.format(summary.investmentContributions)}</p>
          </article>

          <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
            <h2 className="section-title">Alocacao</h2>
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
          </article>
          <AIInput compact />
        </section>

        <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
            <div className="flex items-center gap-2"><Plus size={20} className="text-violet-700" /><h2 className="section-title">{editingId ? "Editar posicao" : "Criar posicao"}</h2></div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="form-field"><span>Ticker</span><input value={draft.ticker} onChange={(event) => setDraft({ ...draft, ticker: event.target.value.toUpperCase() })} placeholder="VWCE" /></label>
              <label className="form-field"><span>Nome</span><input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Vanguard FTSE All-World" /></label>
              <label className="form-field"><span>Tipo</span><select value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value as InvestmentType })}>{investmentTypes.map((type) => <option key={type} value={type}>{investmentTypeLabels[type]}</option>)}</select></label>
              <label className="form-field"><span>Quantidade</span><input type="number" value={draft.quantity} onChange={(event) => setDraft({ ...draft, quantity: Number(event.target.value) })} /></label>
              <label className="form-field"><span>Preco medio</span><input type="number" value={draft.averagePrice} onChange={(event) => setDraft({ ...draft, averagePrice: Number(event.target.value) })} /></label>
              <label className="form-field"><span>Valor atual</span><input type="number" value={draft.currentValue} onChange={(event) => setDraft({ ...draft, currentValue: Number(event.target.value) })} /></label>
              <button className="primary-button sm:col-span-2" onClick={saveInvestment}>{editingId ? "Guardar posicao" : "Criar posicao"}</button>
            </div>
          </article>

          <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
            <h2 className="section-title">Posicoes</h2>
            <div className="mt-4 divide-y divide-slate-100">
              {state.investments.map((investment) => (
                <div key={investment.id} className="flex items-center gap-3 py-4">
                  <div className="grid size-10 place-items-center rounded-xl bg-violet-50 text-violet-700"><TrendingUp size={18} /></div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-black text-slate-950">{investment.ticker} · {investment.name}</p>
                    <p className="text-sm text-slate-500">{investmentTypeLabels[investment.type]} · {investment.quantity} unidades · PM {investment.averagePrice}</p>
                  </div>
                  <p className="font-black text-slate-950">{euro.format(investment.currentValue)}</p>
                  <button className="icon-button" onClick={() => {
                    const { id, ...rest } = investment;
                    setDraft(rest);
                    setEditingId(id);
                  }} aria-label="Editar"><Edit3 size={15} /></button>
                  <button className="icon-button" onClick={() => setState((current) => ({ ...current, investments: current.investments.filter((item) => item.id !== investment.id) }))} aria-label="Eliminar"><Trash2 size={15} /></button>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </AppShell>
  );
}
