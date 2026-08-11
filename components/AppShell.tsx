"use client";

import { Bell, LogOut, Search, Send, Settings } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { desktopNav, mobileNav } from "@/lib/demo-data";

export function AppShell({ children, activePath = "/" }: { children: React.ReactNode; activePath?: string }) {
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
            <p className="text-sm font-bold text-slate-950">Pergunta ao NorteAI</p>
            <span className="rounded-full bg-amber-50 px-2 py-1 text-[0.62rem] font-black uppercase tracking-normal text-amber-700 ring-1 ring-amber-100">
              AI demo
            </span>
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-600">Tens duvidas? O NorteAI esta aqui para ajudar.</p>
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
          <label className="hidden min-w-[280px] flex-1 items-center gap-3 rounded-full bg-slate-100 px-4 py-3 text-sm text-slate-500 ring-1 ring-slate-200 md:flex xl:max-w-[430px]">
            <Search size={18} aria-hidden="true" />
            <span className="sr-only">Pesquisar</span>
            <input className="w-full bg-transparent outline-none placeholder:text-slate-400" placeholder="Pesquisar..." />
            <kbd className="rounded-md bg-white px-2 py-0.5 text-xs font-semibold text-slate-400 shadow-sm">⌘K</kbd>
          </label>
          <div className="flex items-center gap-3">
            <button className="icon-button relative" aria-label="Notificacoes">
              <Bell size={19} aria-hidden="true" />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-rose-500" />
            </button>
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
