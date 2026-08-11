"use client";

import { useState } from "react";
import { Edit3, Plus, Trash2, WalletCards } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { accountTypeLabels, accountTypes, euro } from "@/lib/finance-engine";
import { useFinanceState } from "@/hooks/use-finance-state";
import type { AccountType, FinancialAccountRecord } from "@/types/finance";

const emptyAccount = {
  name: "",
  institution: "",
  accountType: "checking" as AccountType,
  balance: 0,
  currency: "EUR",
  color: "#6d28d9",
  icon: "wallet",
};

export function AccountsPage() {
  const { state, setState, summary } = useFinanceState();
  const [draft, setDraft] = useState<Omit<FinancialAccountRecord, "id">>(emptyAccount);
  const [editingId, setEditingId] = useState<string | null>(null);

  function saveAccount() {
    if (!draft.name || !draft.institution) return;
    setState((current) => ({
      ...current,
      accounts: editingId
        ? current.accounts.map((item) => (item.id === editingId ? { ...draft, id: editingId } : item))
        : [...current.accounts, { ...draft, id: `acc-${Date.now()}` }],
    }));
    setDraft(emptyAccount);
    setEditingId(null);
  }

  function editAccount(account: FinancialAccountRecord) {
    const { id, ...rest } = account;
    setDraft(rest);
    setEditingId(id);
  }

  return (
    <AppShell activePath="/dinheiro">
      <div className="space-y-6">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="page-title">Dinheiro</h1>
            <p className="page-subtitle">Gere contas financeiras reais: bancos, poupanca, dinheiro, corretoras e cripto.</p>
          </div>
          <div className="rounded-2xl bg-white px-5 py-3 shadow-soft ring-1 ring-slate-100">
            <p className="text-xs font-bold text-slate-500">Posicao de liquidez</p>
            <p className="text-2xl font-black text-slate-950">{euro.format(summary.cashPosition)}</p>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {state.accounts.map((account) => (
            <article key={account.id} className="metric-card">
              <div className="flex items-start justify-between gap-3">
                <div className="grid size-11 place-items-center rounded-2xl text-white" style={{ background: account.color }}>
                  <WalletCards size={21} aria-hidden="true" />
                </div>
                <div className="flex gap-2">
                  <button className="icon-button" onClick={() => editAccount(account)} aria-label={`Editar ${account.name}`}>
                    <Edit3 size={16} aria-hidden="true" />
                  </button>
                  <button className="icon-button" onClick={() => setState((current) => ({ ...current, accounts: current.accounts.filter((item) => item.id !== account.id) }))} aria-label={`Eliminar ${account.name}`}>
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
              <p className="mt-4 text-lg font-black text-slate-950">{account.name}</p>
              <p className="text-sm font-bold text-slate-500">{account.institution} · {accountTypeLabels[account.accountType]}</p>
              <p className="mt-4 text-3xl font-black text-slate-950">{euro.format(account.balance)}</p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
          <div className="flex items-center gap-2">
            <Plus size={20} className="text-violet-700" aria-hidden="true" />
            <h2 className="section-title">{editingId ? "Editar conta" : "Criar conta"}</h2>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <label className="form-field">
              <span>Nome</span>
              <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Conta corrente" />
            </label>
            <label className="form-field">
              <span>Instituicao</span>
              <input value={draft.institution} onChange={(event) => setDraft({ ...draft, institution: event.target.value })} placeholder="Millennium" />
            </label>
            <label className="form-field">
              <span>Tipo</span>
              <select value={draft.accountType} onChange={(event) => setDraft({ ...draft, accountType: event.target.value as AccountType })}>
                {accountTypes.map((type) => <option key={type} value={type}>{accountTypeLabels[type]}</option>)}
              </select>
            </label>
            <label className="form-field">
              <span>Saldo</span>
              <input type="number" value={draft.balance} onChange={(event) => setDraft({ ...draft, balance: Number(event.target.value) })} />
            </label>
            <label className="form-field">
              <span>Cor</span>
              <input value={draft.color} onChange={(event) => setDraft({ ...draft, color: event.target.value })} />
            </label>
            <button className="primary-button self-end" onClick={saveAccount}>{editingId ? "Guardar alteracoes" : "Criar conta"}</button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
