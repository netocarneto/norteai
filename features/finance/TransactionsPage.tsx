"use client";

import { useMemo, useState } from "react";
import { Check, Edit3, Filter, Plus, Search, Trash2, Upload } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { accountName, categoryName, categoryTypes, euroCents, inferCategoryId, parseCsv, transactionTypeLabels, transactionTypes } from "@/lib/finance-engine";
import { useFinanceState } from "@/hooks/use-finance-state";
import type { CategoryType, TransactionRecord, TransactionType } from "@/types/finance";

const emptyTransaction = {
  accountId: "",
  date: "2026-08-11",
  description: "",
  merchant: "",
  amount: 0,
  type: "expense" as TransactionType,
  categoryId: "",
  notes: "",
};

export function TransactionsPage() {
  const { state, setState, summary } = useFinanceState();
  const [draft, setDraft] = useState<Omit<TransactionRecord, "id">>(emptyTransaction);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | TransactionType>("all");
  const [dateFilter, setDateFilter] = useState("");
  const [csvText, setCsvText] = useState("date,description,amount\n2026-08-09,Pingo Doce,-42.30\n2026-08-10,Freelance,650");
  const [preview, setPreview] = useState<TransactionRecord[]>([]);
  const [categoryDraft, setCategoryDraft] = useState({ name: "", type: "expense" as CategoryType, icon: "tag", color: "#6d28d9" });
  const [ruleDraft, setRuleDraft] = useState({ merchantKeyword: "", categoryId: "cat-food" });

  const filtered = useMemo(() => {
    return state.transactions
      .filter((item) => typeFilter === "all" || item.type === typeFilter)
      .filter((item) => !dateFilter || item.date === dateFilter)
      .filter((item) => `${item.description} ${item.merchant}`.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [dateFilter, query, state.transactions, typeFilter]);

  function saveTransaction() {
    if (!draft.accountId || !draft.description) return;
    const normalized = {
      ...draft,
      merchant: draft.merchant || draft.description,
      categoryId: draft.categoryId || inferCategoryId(state, draft.merchant || draft.description),
    };
    setState((current) => ({
      ...current,
      transactions: editingId
        ? current.transactions.map((item) => (item.id === editingId ? { ...normalized, id: editingId } : item))
        : [{ ...normalized, id: `trx-${Date.now()}` }, ...current.transactions],
    }));
    setDraft(emptyTransaction);
    setEditingId(null);
  }

  function editTransaction(transaction: TransactionRecord) {
    const { id, ...rest } = transaction;
    setDraft({ ...rest, categoryId: rest.categoryId ?? "", notes: rest.notes ?? "" });
    setEditingId(id);
  }

  function buildPreview() {
    const accountId = state.accounts[0]?.id;
    if (!accountId) return;
    setPreview(parseCsv(csvText, state, accountId));
  }

  function confirmImport() {
    setState((current) => ({ ...current, transactions: [...preview, ...current.transactions] }));
    setPreview([]);
  }

  return (
    <AppShell activePath="/movimentos">
      <div className="space-y-6">
        <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="page-title">Movimentos</h1>
            <p className="page-subtitle">Transacoes manuais, filtros e importacao CSV sem ligacoes bancarias.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:flex">
            <SummaryPill label="Receitas" value={euroCents.format(summary.income)} tone="text-emerald-600" />
            <SummaryPill label="Despesas" value={euroCents.format(summary.expenses)} tone="text-rose-600" />
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[0.95fr_1.4fr]">
          <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
            <div className="flex items-center gap-2">
              <Plus size={20} className="text-violet-700" aria-hidden="true" />
              <h2 className="section-title">{editingId ? "Editar movimento" : "Adicionar movimento"}</h2>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="form-field">
                <span>Conta</span>
                <select value={draft.accountId} onChange={(event) => setDraft({ ...draft, accountId: event.target.value })}>
                  <option value="">Selecionar</option>
                  {state.accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}
                </select>
              </label>
              <label className="form-field">
                <span>Data</span>
                <input type="date" value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} />
              </label>
              <label className="form-field">
                <span>Descricao</span>
                <input value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} placeholder="Continente" />
              </label>
              <label className="form-field">
                <span>Comerciante</span>
                <input value={draft.merchant} onChange={(event) => setDraft({ ...draft, merchant: event.target.value })} placeholder="Continente" />
              </label>
              <label className="form-field">
                <span>Valor</span>
                <input type="number" value={draft.amount} onChange={(event) => setDraft({ ...draft, amount: Number(event.target.value) })} />
              </label>
              <label className="form-field">
                <span>Tipo</span>
                <select value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value as TransactionType })}>
                  {transactionTypes.map((type) => <option key={type} value={type}>{transactionTypeLabels[type]}</option>)}
                </select>
              </label>
              <label className="form-field sm:col-span-2">
                <span>Categoria</span>
                <select value={draft.categoryId} onChange={(event) => setDraft({ ...draft, categoryId: event.target.value })}>
                  <option value="">Auto por regra</option>
                  {state.categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
              </label>
              <button className="primary-button sm:col-span-2" onClick={saveTransaction}>{editingId ? "Guardar movimento" : "Adicionar movimento"}</button>
            </div>
          </article>

          <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
            <div className="grid gap-3 md:grid-cols-[1fr_150px_150px]">
              <label className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
                <Search size={18} className="text-slate-400" aria-hidden="true" />
                <input className="w-full bg-transparent text-sm outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar..." />
              </label>
              <label className="form-field">
                <span className="sr-only">Tipo</span>
                <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as "all" | TransactionType)}>
                  <option value="all">Todos</option>
                  {transactionTypes.map((type) => <option key={type} value={type}>{transactionTypeLabels[type]}</option>)}
                </select>
              </label>
              <label className="form-field">
                <span className="sr-only">Data</span>
                <input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} />
              </label>
            </div>
            <div className="mt-5 divide-y divide-slate-100">
              {filtered.map((transaction) => (
                <div key={transaction.id} className="flex items-center gap-3 py-4">
                  <div className="grid size-10 place-items-center rounded-xl bg-slate-100 text-slate-500">
                    <Filter size={17} aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-black text-slate-950">{transaction.merchant}</p>
                    <p className="text-sm text-slate-500">{transaction.date} · {accountName(state, transaction.accountId)} · {categoryName(state, transaction.categoryId)}</p>
                  </div>
                  <p className={`font-black ${transaction.amount > 0 ? "text-emerald-600" : "text-slate-950"}`}>{euroCents.format(transaction.amount)}</p>
                  <button className="icon-button" onClick={() => editTransaction(transaction)} aria-label="Editar"><Edit3 size={15} /></button>
                  <button className="icon-button" onClick={() => setState((current) => ({ ...current, transactions: current.transactions.filter((item) => item.id !== transaction.id) }))} aria-label="Eliminar"><Trash2 size={15} /></button>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
          <div className="flex items-center gap-2">
            <Upload size={20} className="text-violet-700" aria-hidden="true" />
            <h2 className="section-title">Base de importacao CSV</h2>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
            <textarea className="min-h-36 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:border-violet-500" value={csvText} onChange={(event) => setCsvText(event.target.value)} />
            <div>
              <div className="flex gap-3">
                <button className="primary-button" onClick={buildPreview}>Pre-visualizar</button>
                <button className="primary-button bg-slate-950" onClick={confirmImport} disabled={!preview.length}>
                  <Check size={17} aria-hidden="true" />
                  Confirmar importacao
                </button>
              </div>
              <div className="mt-4 space-y-2">
                {preview.map((row) => (
                  <div key={row.id} className="rounded-2xl bg-slate-50 p-3 text-sm">
                    <span className="font-black text-slate-950">{row.date}</span> · {row.description} · {euroCents.format(row.amount)} · {categoryName(state, row.categoryId)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
          <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
            <div className="flex items-center justify-between gap-3">
              <h2 className="section-title">Categorias</h2>
              <button
                className="primary-button"
                onClick={() => {
                  if (!categoryDraft.name) return;
                  setState((current) => ({ ...current, categories: [...current.categories, { ...categoryDraft, id: `cat-${Date.now()}` }] }));
                  setCategoryDraft({ name: "", type: "expense", icon: "tag", color: "#6d28d9" });
                }}
              >
                <Plus size={17} /> Criar
              </button>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-4">
              <label className="form-field md:col-span-2"><span>Nome</span><input value={categoryDraft.name} onChange={(event) => setCategoryDraft({ ...categoryDraft, name: event.target.value })} placeholder="Restaurantes" /></label>
              <label className="form-field"><span>Tipo</span><select value={categoryDraft.type} onChange={(event) => setCategoryDraft({ ...categoryDraft, type: event.target.value as CategoryType })}>{categoryTypes.map((type) => <option key={type} value={type}>{transactionTypeLabels[type]}</option>)}</select></label>
              <label className="form-field"><span>Cor</span><input value={categoryDraft.color} onChange={(event) => setCategoryDraft({ ...categoryDraft, color: event.target.value })} /></label>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {state.categories.map((category) => (
                <span key={category.id} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-black text-slate-700">
                  <span className="size-2 rounded-full" style={{ background: category.color }} />
                  {category.name}
                  <button onClick={() => setState((current) => ({ ...current, categories: current.categories.filter((item) => item.id !== category.id) }))} aria-label={`Eliminar ${category.name}`}>×</button>
                </span>
              ))}
            </div>
          </article>

          <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
            <div className="flex items-center justify-between gap-3">
              <h2 className="section-title">Regras automaticas</h2>
              <button
                className="primary-button"
                onClick={() => {
                  if (!ruleDraft.merchantKeyword || !ruleDraft.categoryId) return;
                  setState((current) => ({ ...current, categoryRules: [...current.categoryRules, { ...ruleDraft, id: `rule-${Date.now()}` }] }));
                  setRuleDraft({ merchantKeyword: "", categoryId: state.categories[0]?.id ?? "" });
                }}
              >
                <Plus size={17} /> Criar
              </button>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <label className="form-field"><span>Palavra-chave do comerciante</span><input value={ruleDraft.merchantKeyword} onChange={(event) => setRuleDraft({ ...ruleDraft, merchantKeyword: event.target.value })} placeholder="Continente" /></label>
              <label className="form-field"><span>Categoria</span><select value={ruleDraft.categoryId} onChange={(event) => setRuleDraft({ ...ruleDraft, categoryId: event.target.value })}>{state.categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
            </div>
            <div className="mt-5 space-y-2">
              {state.categoryRules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                  <span><b>{rule.merchantKeyword}</b> → {categoryName(state, rule.categoryId)}</span>
                  <button className="font-black text-rose-600" onClick={() => setState((current) => ({ ...current, categoryRules: current.categoryRules.filter((item) => item.id !== rule.id) }))}>Eliminar</button>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </AppShell>
  );
}

function SummaryPill({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-3 shadow-soft ring-1 ring-slate-100">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className={`font-black ${tone}`}>{value}</p>
    </div>
  );
}
