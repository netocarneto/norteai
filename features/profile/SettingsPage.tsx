"use client";

import type { ElementType } from "react";
import { Database, FileSpreadsheet, Globe2, HardDrive, Landmark, LineChart, LogOut, Moon, ShieldCheck, UserRound, UsersRound } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useFinanceState } from "@/hooks/use-finance-state";
import { workspaceTypeLabels } from "@/lib/finance-engine";
import type { DataSourceRecord, DataSourceType } from "@/types/finance";

const sourceCatalog: Array<{
  type: DataSourceType;
  provider: string;
  label: string;
  description: string;
  statusLabel: "Ativa" | "Disponivel" | "Futuro";
  icon: ElementType;
}> = [
  { type: "manual", provider: "Manual", label: "Entrada manual", description: "Dados criados e editados diretamente no NorteAI Pessoal.", statusLabel: "Ativa", icon: Database },
  { type: "csv", provider: "CSV", label: "Importacao CSV", description: "Importacao manual atraves da aba Movimentos, com preview e deduplicacao simples.", statusLabel: "Disponivel", icon: FileSpreadsheet },
  { type: "google_drive", provider: "Google Drive", label: "Google Drive", description: "Estrutura reservada para ficheiros sincronizados no futuro.", statusLabel: "Futuro", icon: HardDrive },
  { type: "open_banking", provider: "Open Banking", label: "Open Banking", description: "Ligacoes bancarias reais nao estao ativas nesta fase.", statusLabel: "Futuro", icon: Landmark },
  { type: "broker_api", provider: "Broker API", label: "Broker API", description: "Integracoes com corretoras ficam para uma fase posterior.", statusLabel: "Futuro", icon: LineChart },
];

export function SettingsPage() {
  const { state, activeWorkspace, workspaces } = useFinanceState();

  return (
    <AppShell activePath="/definicoes">
      <div className="space-y-6">
        <section>
          <h1 className="page-title">Definicoes</h1>
          <p className="page-subtitle">Preferencias da conta, seguranca, fontes de dados e aparencia.</p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SettingsCard icon={UserRound} title="Conta" text="Nome, email, pais e moeda principal." />
          <SettingsCard icon={ShieldCheck} title="Seguranca" text="Autenticacao, sessoes e privacidade dos dados." />
          <SettingsCard icon={Moon} title="Tema" text="Modo claro, escuro e preferencia do sistema." />
          <SettingsCard icon={Globe2} title="Idioma e regiao" text="Portugues, formato Euro e calendario local." />
          <SettingsCard icon={UsersRound} title="Workspaces" text="Base preparada para Pessoal, Familia e Freelancer." />
          <SettingsCard icon={Database} title="Fontes de dados" text="Entrada manual, CSV e integracoes futuras claramente identificadas." />
        </section>

        <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
          <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
            <div className="flex items-center gap-2">
              <UsersRound size={20} className="text-violet-700" aria-hidden="true" />
              <h2 className="section-title">Workspaces</h2>
            </div>
            <div className="mt-4 divide-y divide-slate-100">
              {workspaces.map((workspace) => (
                <div key={workspace.id} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="font-black text-slate-950">{workspace.name}</p>
                    <p className="text-sm font-semibold text-slate-500">{workspaceTypeLabels[workspace.type]}</p>
                  </div>
                  {workspace.id === activeWorkspace?.id ? (
                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-teal-700">Ativo</span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">Preparado</span>
                  )}
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
            <div className="flex items-center gap-2">
              <Database size={20} className="text-violet-700" aria-hidden="true" />
              <h2 className="section-title">Fontes de dados</h2>
            </div>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
              Estado honesto das fontes disponiveis nesta fase. As integracoes futuras nao fazem ligacoes reais.
            </p>
            <div className="mt-4 divide-y divide-slate-100">
              {sourceCatalog.map((source) => {
                const stored = findStoredSource(state.dataSources, source.type, source.provider);
                const Icon = source.icon;
                return (
                <div key={source.type} className="flex items-center justify-between gap-4 py-3">
                  <div className="flex min-w-0 gap-3">
                    <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-slate-50 text-violet-700">
                      <Icon size={18} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-slate-950">{source.label}</p>
                      <p className="text-sm font-semibold leading-5 text-slate-500">{source.description}</p>
                      <p className="mt-1 text-xs font-bold text-slate-400">
                        {stored?.lastSyncAt ? `Ultima atualizacao: ${formatDate(stored.lastSyncAt)}` : stored?.dataUntil ? `Dados ate: ${stored.dataUntil}` : "Sem sincronizacao real"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-black ${source.statusLabel === "Ativa" ? "bg-teal-50 text-teal-700" : source.statusLabel === "Disponivel" ? "bg-violet-50 text-violet-700" : "bg-amber-50 text-amber-700"}`}>
                      {source.statusLabel}
                    </span>
                  </div>
                </div>
                );
              })}
            </div>
          </article>
        </section>

        <a href="/login" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm">
          <LogOut size={18} aria-hidden="true" />
          Sair da conta
        </a>
      </div>
    </AppShell>
  );
}

function findStoredSource(sources: DataSourceRecord[], type: DataSourceType, provider: string) {
  return sources.find((source) => source.type === type || source.provider === provider);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value));
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
