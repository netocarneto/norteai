"use client";

import type { ElementType } from "react";
import { Bell, Globe2, LogOut, Moon, ShieldCheck, UserRound } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export function SettingsPage() {
  return (
    <AppShell activePath="/definicoes">
      <div className="space-y-6">
        <section>
          <h1 className="page-title">Definicoes</h1>
          <p className="page-subtitle">Preferencias da conta, seguranca, notificacoes e aparencia.</p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SettingsCard icon={UserRound} title="Conta" text="Nome, email, pais e moeda principal." />
          <SettingsCard icon={ShieldCheck} title="Seguranca" text="Autenticacao, sessoes e privacidade dos dados." />
          <SettingsCard icon={Bell} title="Notificacoes" text="Alertas de movimentos, objetivos e oportunidades." />
          <SettingsCard icon={Moon} title="Tema" text="Modo claro, escuro e preferencia do sistema." />
          <SettingsCard icon={Globe2} title="Idioma e regiao" text="Portugues, formato Euro e calendario local." />
        </section>

        <a href="/login" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm">
          <LogOut size={18} aria-hidden="true" />
          Sair da conta
        </a>
      </div>
    </AppShell>
  );
}

function SettingsCard({ icon: Icon, title, text }: { icon: ElementType; title: string; text: string }) {
  return (
    <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
      <Icon size={22} className="text-violet-700" aria-hidden="true" />
      <h2 className="mt-4 font-black text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </article>
  );
}
