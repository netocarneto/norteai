"use client";

import { useState } from "react";
import { Edit3, Plus, Trash2, WalletCards } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { accountTypeLabels, accountTypes, euro, ownershipTypeLabels } from "@/lib/finance-engine";
import { useFinanceState } from "@/hooks/use-finance-state";
import type { AccountType, FinancialAccountRecord, OwnershipType } from "@/types/finance";

const emptyAccount = {
  name: "",
  institution: "",
  accountType: "checking" as AccountType,
  balance: 0,
  currency: "EUR",
  ownershipType: "personal" as OwnershipType,
  ownershipPercentage: 100,
  source: "manual" as const,
  color: "#6d28d9",
  icon: "wallet",
  createdAt: "2026-08-11T09:00:00.000Z",
  updatedAt: "2026-08-11T09:00:00.000Z",
};

export function AccountsPage() {
  const { state, setState, summary, activeWorkspace } = useFinanceState();
  const [draft, setDraft] = useState<Omit<FinancialAccountRecord, "id" | "workspaceId"> & { ownershipPercentage: number }>(emptyAccount);
  const [editingId, setEditingId] = useState<string | null>(null);

  function saveAccount() {
    if (!draft.name || !draft.institution || !activeWorkspace) return;
    if (draft.balance < 0 || draft.ownershipPercentage < 0 || draft.ownershipPercentage > 100) return;
    const { ownershipPercentage, ...accountDraft } = draft;
    const now = new Date().toISOString();
    const account = { ...accountDraft, ownershipPercentage, workspaceId: activeWorkspace.id, updatedAt: now, createdAt: editingId ? accountDraft.createdAt : now };
    const accountId = editingId ?? `acc-${Date.now()}`;
    setState((current) => ({
      ...current,
      accounts: editingId
        ? current.accounts.map((item) => (item.id === editingId ? { ...account, id: accountId } : item))
        : [...current.accounts, { ...account, id: accountId }],
      accountOwnerships: editingId
        ? current.accountOwnerships.map((item) => (item.accountId === editingId ? { ...item, ownershipPercentage } : item))
        : [
            ...current.accountOwnerships,
            {
              id: `own-${Date.now()}`,
              workspaceId: activeWorkspace.id,
              accountId,
              memberId: current.workspaceMembers.find((member) => member.workspaceId === activeWorkspace.id)?.id ?? "member-diogo-personal",
              ownershipPercentage,
            },
          ],
    }));
    setDraft(emptyAccount);
    setEditingId(null);
  }

  function editAccount(account: FinancialAccountRecord) {
    const ownership = state.accountOwnerships.find((item) => item.accountId === account.id);
    setDraft({
      name: account.name,
      institution: account.institution,
      accountType: account.accountType,
      balance: account.balance,
      currency: account.currency,
      ownershipType: account.ownershipType,
      ownershipPercentage: ownership?.ownershipPercentage ?? 100,
      source: account.source,
      color: account.color,
      icon: account.icon,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    });
    setEditingId(account.id);
  }

  return (
    <AppShell activePath="/dinheiro">
      <div className="space-y-6">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="page-title">Dinheiro</h1>
            <p className="page-subtitle">Gere contas correntes, poupanca, dinheiro, corretoras, cripto e outras contas pessoais.</p>
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
              <p className="text-sm font-bold text-slate-500">{account.institution} · {accountTypeLabels[account.accountType]} · {ownershipTypeLabels[account.ownershipType]}</p>
              <p className="mt-4 text-3xl font-black text-slate-950">{euro.format(account.balance)}</p>
              {account.ownershipType === "shared" ? (
                <p className="mt-2 text-xs font-black text-violet-700">
                  Valor atribuivel: {euro.format(account.balance * (account.ownershipPercentage / 100))}
                </p>
              ) : null}
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
              <span>Propriedade</span>
              <select value={draft.ownershipType} onChange={(event) => setDraft({ ...draft, ownershipType: event.target.value as OwnershipType, ownershipPercentage: event.target.value === "personal" ? 100 : draft.ownershipPercentage })}>
                <option value="personal">Pessoal</option>
                <option value="shared">Partilhada</option>
              </select>
            </label>
            <label className="form-field">
              <span>Percentagem</span>
              <input type="number" min={0} max={100} value={draft.ownershipPercentage} onChange={(event) => setDraft({ ...draft, ownershipPercentage: Number(event.target.value) })} />
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
