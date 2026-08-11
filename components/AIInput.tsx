"use client";

import { Send, Sparkles } from "lucide-react";
import { aiSuggestions } from "@/lib/demo-data";

export function AIInput({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100 ${compact ? "" : "sm:p-6"}`}>
      <div className="flex items-center gap-2 text-sm font-black text-violet-700">
        <Sparkles size={18} aria-hidden="true" />
        <span>NorteAI diz</span>
        <span className="rounded-full bg-amber-50 px-2 py-1 text-[0.65rem] font-black uppercase tracking-normal text-amber-700 ring-1 ring-amber-100">
          AI demo
        </span>
      </div>
      <p className="mt-5 text-sm leading-6 text-slate-700">
        A tua exposicao ao mercado dos EUA esta acima do recomendado para o teu perfil.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {aiSuggestions.map((suggestion) => (
          <button key={suggestion} className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-violet-50 hover:text-violet-700">
            {suggestion}
          </button>
        ))}
      </div>
      <label className="mt-5 flex items-center gap-2 rounded-2xl bg-slate-50 p-2 ring-1 ring-slate-200">
        <span className="sr-only">Pergunta ao NorteAI</span>
        <input className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-slate-400" placeholder="Pergunta ao NorteAI" />
        <button className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-600 text-white" aria-label="Enviar pergunta">
          <Send size={17} aria-hidden="true" />
        </button>
      </label>
    </section>
  );
}
