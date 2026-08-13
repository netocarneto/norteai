"use client";

import { useMemo, useState } from "react";
import { Check, Edit3, Filter, Plus, Search, Trash2, Upload } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { confirmDeletion, explainDeletionBlock } from "@/lib/destructive-actions";
import { accountName, categoryName, categoryTypes, euroCents, inferCategoryId, isDuplicateTransaction, parseCsv, transactionTypeLabels, transactionTypes } from "@/lib/finance-engine";
import { useFinanceState } from "@/hooks/use-finance-state";
import type { CategoryType, TransactionRecord, TransactionType } from "@/types/finance";

const emptyTransaction = {
  accountId: "",
  date: "2026-08-11",
  description: "",
  merchant: "",
  amount: 0,
  currency: "EUR",
  type: "expense" as TransactionType,
  category: "",
  source: "manual" as const,
  categoryId: "",
  notes: "",
  createdAt: "2026-08-11T09:00:00.000Z",
  updatedAt: "2026-08-11T09:00:00.000Z",
};

const pageSize = 6;

export function TransactionsPage() {
  const { state, setState, summary, activeWorkspace } = useFinanceState();
  const [draft, setDraft] = useState<Omit<TransactionRecord, "id" | "workspaceId">>(emptyTransaction);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | TransactionType>("all");
  const [accountFilter, setAccountFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");
  const [page, setPage] = useState(1);
  const [csvText, setCsvText] = useState("date,description,amount\n2026-08-09,Pingo Doce,-42.30\n2026-08-10,Freelance,650");
  const [preview, setPreview] = useState<TransactionRecord[]>([]);
  const [importStats, setImportStats] = useState<{ imported: number; skipped: number } | null>(null);
  const [categoryDraft, setCategoryDraft] = useState({ name: "", type: "expense" as CategoryType, icon: "tag", color: "#6d28d9" });
  const [ruleDraft, setRuleDraft] = useState({ merchantKeyword: "", categoryId: "cat-food" });

  const filtered = useMemo(() => {
    return state.transactions
      .filter((item) => typeFilter === "all" || item.type === typeFilter)
      .filter((item) => accountFilter === "all" || item.accountId === accountFilter)
      .filter((item) => categoryFilter === "all" || item.categoryId === categoryFilter)
      .filter((item) => !dateFilter || item.date === dateFilter)
      .filter((item) => `${item.description} ${item.merchant}`.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => sortDirection === "desc" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
  }, [accountFilter, categoryFilter, dateFilter, query, sortDirection, state.transactions, typeFilter]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  function saveTransaction() {
    if (!draft.accountId || !draft.description || !activeWorkspace || draft.amount === 0) return;
    const categoryId = draft.categoryId || inferCategoryId(state, draft.merchant || draft.description);
    const now = new Date().toISOString();
    const normalized = {
      ...draft,
      workspaceId: activeWorkspace.id,
      merchant: draft.merchant || draft.description,
      currency: draft.currency || "EUR",
      categoryId,
      category: draft.category || categoryName(state, categoryId),
      source: draft.source || "manual",
      updatedAt: now,
      createdAt: editingId ? draft.createdAt : now,
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
    setDraft({
      accountId: transaction.accountId,
      date: transaction.date,
      description: transaction.description,
      merchant: transaction.merchant,
      amount: transaction.amount,
      currency: transaction.currency,
      type: transaction.type,
      category: transaction.category,
      source: transaction.source,
      externalReference: transaction.externalReference,
      importBatchId: transaction.importBatchId,
      categoryId: transaction.categoryId ?? "",
      notes: transaction.notes ?? "",
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    });
    setEditingId(transaction.id);
  }

  function buildPreview() {
    const accountId = state.accounts[0]?.id;
    if (!accountId) return;
    setPreview(parseCsv(csvText, state, accountId));
  }

  function confirmImport() {
    setState((current) => {
      const fresh = preview.filter((transaction) => !isDuplicateTransaction(current.transactions, transaction));
      setImportStats({ imported: fresh.length, skipped: preview.length - fresh.length });
      return { ...current, transactions: [...fresh, ...current.transactions] };
    });
    setPreview([]);
  }

  function deleteTransaction(transaction: TransactionRecord) {
    if (!confirmDeletion(transaction.merchant || transaction.description)) return;
    setState((current) => ({ ...current, transactions: current.transactions.filter((item) => item.id !== transaction.id) }));
  }

  function deleteCategory(categoryId: string, categoryLabel: string) {
    const isUsedByTransaction = state.transactions.some((transaction) => transaction.categoryId === categoryId);
    const isUsedByRule = state.categoryRules.some((rule) => rule.categoryId === categoryId);

    if (isUsedByTransaction || isUsedByRule) {
      explainDeletionBlock("Esta categoria está associada a movimentos ou regras automáticas. Remove essas associações antes de eliminar a categoria.");
      return;
    }

    if (!confirmDeletion(categoryLabel)) return;
    setState((current) => ({ ...current, categories: current.categories.filter((item) => item.id !== categoryId) }));
  }

  function deleteRule(ruleId: string, merchantKeyword: string) {
    if (!confirmDeletion(`regra ${merchantKeyword}`)) return;
    setState((current) => ({ ...current, categoryRules: current.categoryRules.filter((item) => item.id !== ruleId) }));
  }

  return (
    <AppShell activePath="/movimentos">
      <div className="space-y-6">
        <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="page-title">Movimentos</h1>
            <p className="page-subtitle">Transações manuais, filtros e importação CSV sem ligações bancárias.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:flex">
            <SummaryPill label="Receitas" value={euroCents.format(summary.income)} tone="text-emerald-600" />
            <SummaryPill label="Despesas" value={euroCents.format(summary.expenses)} tone="text-rose-600" />
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.4fr)]">
          <article className="min-w-0 rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
            <div className="flex items-center gap-2">
              <Plus size={20} className="text-violet-700" aria-hidden="true" />
              <h2 className="section-title">{editingId ? "Editar movimento" : "Adicionar movimento"}</h2>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
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
                <span>Descrição</span>
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
              <button className="primary-button md:col-span-2 xl:col-span-1 2xl:col-span-2" onClick={saveTransaction} disabled={!state.accounts.length}>
                {editingId ? "Guardar movimento" : state.accounts.length ? "Adicionar movimento" : "Cria uma conta primeiro"}
              </button>
            </div>
          </article>

          <article className="min-w-0 rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(170px,1fr)_130px_150px] 2xl:grid-cols-[minmax(180px,1fr)_130px_150px_150px_130px]">
              <label className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
                <Search size={18} className="text-slate-400" aria-hidden="true" />
                <input className="min-w-0 w-full bg-transparent text-sm outline-none" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Pesquisar..." />
              </label>
              <label className="form-field">
                <span className="sr-only">Tipo</span>
                <select value={typeFilter} onChange={(event) => { setTypeFilter(event.target.value as "all" | TransactionType); setPage(1); }}>
                  <option value="all">Todos</option>
                  {transactionTypes.map((type) => <option key={type} value={type}>{transactionTypeLabels[type]}</option>)}
                </select>
              </label>
              <label className="form-field">
                <span className="sr-only">Conta</span>
                <select value={accountFilter} onChange={(event) => { setAccountFilter(event.target.value); setPage(1); }}>
                  <option value="all">Todas as contas</option>
                  {state.accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}
                </select>
              </label>
              <label className="form-field">
                <span className="sr-only">Categoria</span>
                <select value={categoryFilter} onChange={(event) => { setCategoryFilter(event.target.value); setPage(1); }}>
                  <option value="all">Categorias</option>
                  {state.categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
              </label>
              <label className="form-field">
                <span className="sr-only">Data</span>
                <input type="date" value={dateFilter} onChange={(event) => { setDateFilter(event.target.value); setPage(1); }} />
              </label>
              <label className="form-field">
                <span className="sr-only">Ordenacao</span>
                <select value={sortDirection} onChange={(event) => { setSortDirection(event.target.value as "desc" | "asc"); setPage(1); }}>
                  <option value="desc">Mais recentes</option>
                  <option value="asc">Mais antigos</option>
                </select>
              </label>
            </div>
            <div className="mt-5 divide-y divide-slate-100">
              {pageItems.length ? (
                pageItems.map((transaction) => (
                  <div key={transaction.id} className="flex min-w-0 flex-wrap items-center gap-3 py-4">
                    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500">
                      <Filter size={17} aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1 basis-[12rem]">
                      <p className="truncate font-black text-slate-950">{transaction.merchant}</p>
                      <p className="truncate text-sm text-slate-500">{transaction.date} · {accountName(state, transaction.accountId)} · {categoryName(state, transaction.categoryId)}</p>
                    </div>
                    <p className={`shrink-0 font-black ${transaction.amount > 0 ? "text-emerald-600" : "text-slate-950"}`}>{euroCents.format(transaction.amount)}</p>
                    <div className="flex shrink-0 gap-2">
                      <button className="icon-button" onClick={() => editTransaction(transaction)} aria-label="Editar"><Edit3 size={15} /></button>
                      <button className="icon-button" onClick={() => deleteTransaction(transaction)} aria-label="Eliminar"><Trash2 size={15} /></button>
                    </div>
                  </div>
                ))
              ) : state.transactions.length ? (
                <div className="py-4">
                  <EmptyState title="Sem resultados" description="Ajusta a pesquisa, filtros ou data para encontrares outros movimentos." />
                </div>
              ) : (
                <div className="py-4">
                  <EmptyState title="Ainda não tens movimentos" description="Adiciona manualmente uma receita, despesa ou investimento para veres o histórico aqui." />
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between gap-3 text-sm font-bold text-slate-500">
              <span>{filtered.length} movimentos</span>
              <div className="flex items-center gap-2">
                <button className="rounded-full border border-slate-200 px-3 py-1.5 disabled:opacity-40" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Anterior</button>
                <span>{page}/{pageCount}</span>
                <button className="rounded-full border border-slate-200 px-3 py-1.5 disabled:opacity-40" disabled={page >= pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))}>Seguinte</button>
              </div>
            </div>
          </article>
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
          <div className="flex items-center gap-2">
            <Upload size={20} className="text-violet-700" aria-hidden="true" />
            <h2 className="section-title">Base de importação CSV</h2>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <textarea aria-label="Conteúdo CSV" className="min-h-36 min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:border-violet-500" value={csvText} onChange={(event) => setCsvText(event.target.value)} />
            <div className="min-w-0">
              <div className="flex flex-wrap gap-3">
                <button className="primary-button" onClick={buildPreview}>Pré-visualizar</button>
                <button className="primary-button bg-slate-950" onClick={confirmImport} disabled={!preview.length}>
                  <Check size={17} aria-hidden="true" />
                  Confirmar importação
                </button>
              </div>
              <div className="mt-4 space-y-2">
                {importStats ? (
                  <div className="rounded-2xl bg-teal-50 p-3 text-sm font-black text-teal-700">
                    {importStats.imported} novos · {importStats.skipped} ignorados por duplicação
                  </div>
                ) : null}
                {preview.map((row) => (
                  <div key={row.id} className="rounded-2xl bg-slate-50 p-3 text-sm">
                    <span className="font-black text-slate-950">{row.date}</span> · {row.description} · {euroCents.format(row.amount)} · {categoryName(state, row.categoryId)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <article className="min-w-0 rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
            <div className="flex items-center justify-between gap-3">
              <h2 className="section-title">Categorias</h2>
              <button
                className="primary-button"
                onClick={() => {
                  if (!categoryDraft.name) return;
                  if (!activeWorkspace) return;
                  setState((current) => ({ ...current, categories: [...current.categories, { ...categoryDraft, workspaceId: activeWorkspace.id, id: `cat-${Date.now()}` }] }));
                  setCategoryDraft({ name: "", type: "expense", icon: "tag", color: "#6d28d9" });
                }}
              >
                <Plus size={17} /> Criar
              </button>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
              <label className="form-field md:col-span-2"><span>Nome</span><input value={categoryDraft.name} onChange={(event) => setCategoryDraft({ ...categoryDraft, name: event.target.value })} placeholder="Restaurantes" /></label>
              <label className="form-field"><span>Tipo</span><select value={categoryDraft.type} onChange={(event) => setCategoryDraft({ ...categoryDraft, type: event.target.value as CategoryType })}>{categoryTypes.map((type) => <option key={type} value={type}>{transactionTypeLabels[type]}</option>)}</select></label>
              <label className="form-field"><span>Cor</span><input value={categoryDraft.color} onChange={(event) => setCategoryDraft({ ...categoryDraft, color: event.target.value })} /></label>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {state.categories.map((category) => (
                <span key={category.id} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-black text-slate-700">
                  <span className="size-2 rounded-full" style={{ background: category.color }} />
                  {category.name}
                  <button onClick={() => deleteCategory(category.id, category.name)} aria-label={`Eliminar ${category.name}`}>×</button>
                </span>
              ))}
            </div>
          </article>

          <article className="min-w-0 rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
            <div className="flex items-center justify-between gap-3">
              <h2 className="section-title">Regras automáticas</h2>
              <button
                className="primary-button"
                onClick={() => {
                  if (!ruleDraft.merchantKeyword || !ruleDraft.categoryId) return;
                  if (!activeWorkspace) return;
                  setState((current) => ({ ...current, categoryRules: [...current.categoryRules, { ...ruleDraft, workspaceId: activeWorkspace.id, id: `rule-${Date.now()}` }] }));
                  setRuleDraft({ merchantKeyword: "", categoryId: state.categories[0]?.id ?? "" });
                }}
              >
                <Plus size={17} /> Criar
              </button>
            </div>
            <div className="mt-5 grid gap-3 2xl:grid-cols-2">
              <label className="form-field"><span>Palavra-chave do comerciante</span><input value={ruleDraft.merchantKeyword} onChange={(event) => setRuleDraft({ ...ruleDraft, merchantKeyword: event.target.value })} placeholder="Continente" /></label>
              <label className="form-field"><span>Categoria</span><select value={ruleDraft.categoryId} onChange={(event) => setRuleDraft({ ...ruleDraft, categoryId: event.target.value })}>{state.categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
            </div>
            <div className="mt-5 space-y-2">
              {state.categoryRules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                  <span><b>{rule.merchantKeyword}</b> → {categoryName(state, rule.categoryId)}</span>
                  <button className="font-black text-rose-600" onClick={() => deleteRule(rule.id, rule.merchantKeyword)}>Eliminar</button>
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
