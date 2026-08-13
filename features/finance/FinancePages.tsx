"use client";

import { AppShell } from "@/components/AppShell";
import { AIInput } from "@/components/AIInput";

export function NorteAIPage() {
  return (
    <AppShell activePath="/norteai">
      <div className="space-y-6">
        <section>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="page-title">NorteAI</h1>
            <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-black uppercase tracking-normal text-amber-700 ring-1 ring-amber-100">
              Em desenvolvimento
            </span>
          </div>
          <p className="page-subtitle">Área do assistente financeiro, sem ligação real nesta fase.</p>
        </section>
        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <AIInput />
          <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
            <div className="flex items-center justify-between gap-3">
              <h2 className="section-title">Análise completa</h2>
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-normal text-amber-700 ring-1 ring-amber-100">
                Futuro
              </span>
            </div>
            <div className="mt-5 space-y-4">
              {[
                "Motor generativo não implementado nesta fase.",
                "OpenAI, MCP e chat financeiro estão fora do âmbito atual.",
                "O foco atual é manter dados pessoais, cálculos e importação manual consistentes.",
                "As recomendações futuras deverão usar a mesma base de workspaces e permissões.",
              ].map((item) => (
                <p key={item} className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">{item}</p>
              ))}
            </div>
          </article>
        </section>
      </div>
    </AppShell>
  );
}
