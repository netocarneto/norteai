"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, LogOut, Search, Send, Settings } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { desktopNav, mobileNav } from "@/lib/demo-data";
import { useFinanceState } from "@/hooks/use-finance-state";
import { accountName, categoryName, euro, euroCents, workspaceTypeLabels } from "@/lib/finance-engine";
import type { FinanceState } from "@/types/finance";

type SearchResult = {
  id: string;
  href: string;
  eyebrow: string;
  title: string;
  detail: string;
};

export function AppShell({ children, activePath = "/" }: { children: React.ReactNode; activePath?: string }) {
  const { state, activeWorkspace, workspaces, setActiveWorkspace } = useFinanceState();

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)]">
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[250px] border-r border-slate-200 bg-white/92 px-5 py-7 shadow-sidebar backdrop-blur xl:block">
        <BrandMark />
        <nav className="mt-9 space-y-1.5" aria-label="Principal">
          {desktopNav.map((item) => {
            const Icon = item.icon;
            const active = activePath === item.href;
            return (
              <a key={item.href} href={item.href} className={`nav-link ${active ? "nav-link-active" : ""}`}>
                <Icon size={20} aria-hidden="true" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
        <div className="mt-8 border-t border-slate-100 pt-5">
          <a href="/definicoes" className={`nav-link ${activePath === "/definicoes" ? "nav-link-active" : ""}`}>
            <Settings size={20} aria-hidden="true" />
            <span>Definicoes</span>
          </a>
          <a href="/login" className="nav-link">
            <LogOut size={20} aria-hidden="true" />
            <span>Sair</span>
          </a>
        </div>
        <div className="absolute bottom-7 left-5 right-5 rounded-2xl bg-violet-50 p-4 ring-1 ring-violet-100">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-bold text-slate-950">NorteAI</p>
            <span className="rounded-full bg-amber-50 px-2 py-1 text-[0.62rem] font-black uppercase tracking-normal text-amber-700 ring-1 ring-amber-100">
              Futuro
            </span>
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-600">Assistente financeiro reservado para uma fase futura.</p>
          <a href="/norteai" className="mt-4 inline-grid size-10 place-items-center rounded-full bg-violet-600 text-white shadow-soft" aria-label="Abrir NorteAI">
            <Send size={17} aria-hidden="true" />
          </a>
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/82 px-4 py-3 backdrop-blur xl:ml-[250px] xl:px-8">
        <div className="mx-auto flex max-w-[1220px] items-center justify-between gap-4">
          <div className="xl:hidden">
            <BrandMark compact />
          </div>
          <GlobalSearch state={state} />
          <div className="flex items-center gap-3">
            <label className="hidden items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-black text-slate-600 ring-1 ring-slate-200 lg:flex">
              <span>{activeWorkspace ? workspaceTypeLabels[activeWorkspace.type] : "Workspace"}</span>
              <select
                className="max-w-40 bg-transparent text-sm font-black text-slate-950 outline-none"
                value={activeWorkspace?.id ?? ""}
                onChange={(event) => setActiveWorkspace(event.target.value)}
                aria-label="Workspace ativo"
              >
                {workspaces.map((workspace) => (
                  <option key={workspace.id} value={workspace.id}>
                    {workspace.name}
                  </option>
                ))}
              </select>
            </label>
            <a href="/profile" className="flex items-center gap-3 rounded-full bg-white px-1.5 py-1.5 text-sm font-bold text-slate-900 ring-1 ring-slate-200">
              <span className="grid size-9 place-items-center rounded-full bg-violet-700 text-white">D</span>
              <span className="hidden sm:inline">Diogo</span>
            </a>
          </div>
        </div>
      </header>

      <main className="pb-24 xl:ml-[250px] xl:pb-8">
        <div className="mx-auto max-w-[1220px] px-4 py-5 sm:px-6 xl:px-8">{children}</div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-3 py-2 shadow-[0_-18px_35px_rgba(15,23,42,0.08)] backdrop-blur xl:hidden" aria-label="Mobile">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {mobileNav.map((item) => {
            const Icon = item.icon;
            const active = activePath === item.href;
            return (
              <a key={item.href} href={item.href} className={`mobile-nav-link ${active ? "mobile-nav-active" : ""}`}>
                <Icon size={20} aria-hidden="true" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function GlobalSearch({ state }: { state: FinanceState }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cleanQuery = normalizeSearchText(query);
  const results = useMemo(() => buildSearchResults(state, cleanQuery), [state, cleanQuery]);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      }
      if (event.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  return (
    <div className="relative hidden min-w-[280px] flex-1 md:block xl:max-w-[430px]">
      <label className="flex items-center gap-3 rounded-full bg-slate-100 px-4 py-3 text-sm text-slate-500 ring-1 ring-slate-200 focus-within:bg-white focus-within:ring-violet-200">
        <Search size={18} aria-hidden="true" />
        <span className="sr-only">Pesquisar</span>
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full bg-transparent outline-none placeholder:text-slate-400"
          placeholder="Pesquisar..."
        />
        <kbd className="rounded-md bg-white px-2 py-0.5 text-xs font-semibold text-slate-400 shadow-sm">⌘K</kbd>
      </label>

      {isOpen && query.trim() ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-50 overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-slate-200">
          <div className="max-h-[420px] overflow-y-auto p-2">
            {results.length ? (
              results.map((result) => (
                <a
                  key={result.id}
                  href={result.href}
                  onClick={() => setIsOpen(false)}
                  className="group flex items-center gap-3 rounded-2xl px-3 py-3 transition hover:bg-violet-50"
                >
                  <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-violet-700">
                    <Search size={16} aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.68rem] font-black uppercase tracking-normal text-slate-400">{result.eyebrow}</p>
                    <p className="truncate text-sm font-black text-slate-950">{result.title}</p>
                    <p className="truncate text-xs font-semibold text-slate-500">{result.detail}</p>
                  </div>
                  <ArrowRight size={16} className="shrink-0 text-slate-300 group-hover:text-violet-700" aria-hidden="true" />
                </a>
              ))
            ) : (
              <p className="px-4 py-6 text-sm font-semibold text-slate-500">Sem resultados para {query}.</p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function buildSearchResults(state: FinanceState, query: string): SearchResult[] {
  if (!query) return [];

  const results: SearchResult[] = [
    ...state.accounts.map((account) => ({
      id: `account-${account.id}`,
      href: "/dinheiro",
      eyebrow: "Conta",
      title: account.name,
      detail: `${account.institution} · ${euro.format(account.balance)}`,
    })),
    ...state.transactions.map((transaction) => ({
      id: `transaction-${transaction.id}`,
      href: "/movimentos",
      eyebrow: "Movimento",
      title: transaction.description,
      detail: `${transaction.date} · ${accountName(state, transaction.accountId)} · ${categoryName(state, transaction.categoryId) || transaction.category} · ${euroCents.format(transaction.amount)}`,
    })),
    ...state.categories.map((category) => ({
      id: `category-${category.id}`,
      href: "/movimentos",
      eyebrow: "Categoria",
      title: category.name,
      detail: "Categoria de movimentos",
    })),
    ...state.investments.map((investment) => ({
      id: `investment-${investment.id}`,
      href: "/investimentos",
      eyebrow: "Investimento",
      title: `${investment.ticker} · ${investment.name}`,
      detail: `${investment.institution} · ${euro.format(investment.currentValue)}`,
    })),
    ...state.assets.map((asset) => ({
      id: `asset-${asset.id}`,
      href: "/patrimonio",
      eyebrow: "Ativo",
      title: asset.name,
      detail: euro.format(asset.value),
    })),
    ...state.liabilities.map((liability) => ({
      id: `liability-${liability.id}`,
      href: "/patrimonio",
      eyebrow: "Divida",
      title: liability.name,
      detail: `${euro.format(liability.balance)} em aberto`,
    })),
    ...state.financialGoals.map((goal) => ({
      id: `goal-${goal.id}`,
      href: "/goals",
      eyebrow: "Objetivo",
      title: goal.name,
      detail: `${euro.format(goal.currentValue)} de ${euro.format(goal.targetValue)}`,
    })),
  ];

  return results
    .filter((result) => normalizeSearchText(`${result.eyebrow} ${result.title} ${result.detail}`).includes(query))
    .slice(0, 8);
}

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
