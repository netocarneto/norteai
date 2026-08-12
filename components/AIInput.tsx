"use client";

import { Sparkles } from "lucide-react";

export function AIInput({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100 ${compact ? "" : "sm:p-6"}`}>
      <div className="flex items-center gap-2 text-sm font-black text-violet-700">
        <Sparkles size={18} aria-hidden="true" />
        <span>Assistente NorteAI</span>
        <span className="rounded-full bg-amber-50 px-2 py-1 text-[0.65rem] font-black uppercase tracking-normal text-amber-700 ring-1 ring-amber-100">
          Futuro
        </span>
      </div>
      <p className="mt-5 text-sm leading-6 text-slate-700">
        Area reservada para uma fase futura. Nesta versao, as analises apresentadas sao calculadas por regras financeiras e dados registados.
      </p>
    </section>
  );
}
