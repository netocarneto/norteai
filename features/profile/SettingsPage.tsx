"use client";

import type { ElementType } from "react";
import { Database, FileSpreadsheet, Globe2, HardDrive, Landmark, LineChart, LogOut, Moon, ShieldCheck, UserRound, UsersRound } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useFinanceState } from "@/hooks/use-finance-state";
import { workspaceTypeLabels } from "@/lib/finance-engine";
import type { DataSourceRecord, DataSourceStatus, DataSourceType } from "@/types/finance";

const sourceCatalog: Array<{
  type: DataSourceType;
  provider: string;
  label: string;
  description: string;
  statusLabel: "Ativa" | "Disponível" | "Futuro";
  icon: ElementType;
}> = [
  { type: "manual", provider: "Manual", label: "Entrada manual", description: "Dados criados e editados diretamente no NorteAI Pessoal.", statusLabel: "Ativa", icon: Database },
  { type: "csv", provider: "CSV", label: "Importação CSV", description: "Importação manual através da aba Movimentos, com preview e deduplicação simples.", statusLabel: "Disponível", icon: FileSpreadsheet },
  { type: "google_drive", provider: "Google Drive", label: "Google Drive", description: "Estrutura reservada para ficheiros sincronizados no futuro.", statusLabel: "Futuro", icon: HardDrive },
  { type: "open_banking", provider: "Open Banking", label: "Open Banking", description: "Ligações bancárias reais não estão ativas nesta fase.", statusLabel: "Futuro", icon: Landmark },
  { type: "broker_api", provider: "Broker API", label: "Broker API", description: "Integrações com corretoras ficam para uma fase posterior.", statusLabel: "Futuro", icon: LineChart },
];

export function SettingsPage() {
  const { state, activeWorkspace, workspaces, setActiveWorkspace } = useFinanceState();

  return (
    <AppShell activePath="/definicoes">
      <div className="space-y-6">
        <section>
          <h1 className="page-title">Definições</h1>
          <p className="page-subtitle">Perfil, preferências, fontes de dados, segurança e informação do produto.</p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SettingsCard icon={UserRound} title="Perfil" text="Nome, email, país, moeda principal e preferências pessoais." />
          <SettingsCard icon={ShieldCheck} title="Segurança e privacidade" text="Autenticação, sessões e isolamento dos dados por workspace." />
          <SettingsCard icon={Moon} title="Tema" text="Modo claro, escuro e preferência do sistema." />
          <SettingsCard icon={Globe2} title="Idioma e região" text="Português de Portugal, formato Euro e calendário local." />
          <SettingsCard icon={UsersRound} title="Workspaces" text="Pessoal ativo; Família e Freelancer permanecem apenas preparados." />
          <SettingsCard icon={Database} title="Fontes de dados" text="Entrada manual, CSV e integrações futuras claramente identificadas." />
        </section>

        <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
          <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
            <div className="flex items-center gap-2">
              <UsersRound size={20} className="text-violet-700" aria-hidden="true" />
              <h2 className="section-title">Workspaces</h2>
            </div>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
              O NorteAI Pessoal está ativo. Os restantes workspaces ficam preservados na arquitetura, mas não fazem parte do produto fechado nesta fase.
            </p>
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
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">Preparado</span>
                      <button
                        type="button"
                        className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white"
                        onClick={() => setActiveWorkspace(workspace.id)}
                      >
                        Usar
                      </button>
                    </div>
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
              Estado honesto das fontes disponíveis nesta fase. As integrações futuras não fazem ligações reais.
            </p>
            <FinancialSources state={state} />
          </article>
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
          <div className="flex items-center gap-2">
            <Database size={20} className="text-violet-700" aria-hidden="true" />
            <h2 className="section-title">Integrações futuras</h2>
          </div>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
            Estrutura preparada para fontes adicionais, sem simular sincronização automática.
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
                        {stored?.lastSyncAt ? `Última atualização: ${formatDate(stored.lastSyncAt)}` : stored?.dataUntil ? `Dados até: ${stored.dataUntil}` : "Sem sincronização real"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-black ${source.statusLabel === "Ativa" ? "bg-teal-50 text-teal-700" : source.statusLabel === "Disponível" ? "bg-violet-50 text-violet-700" : "bg-amber-50 text-amber-700"}`}>
                      {source.statusLabel}
                    </span>
                  </div>
                </div>
                );
              })}
            </div>
        </section>

        <a href="/login" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm">
          <LogOut size={18} aria-hidden="true" />
          Sair da conta
        </a>
      </div>
    </AppShell>
  );
}

function FinancialSources({ state }: { state: ReturnType<typeof useFinanceState>["state"] }) {
  type SourceRow = {
    name: string;
    type: DataSourceType;
    lastSyncAt?: string;
    dataUntil?: string;
    status?: DataSourceStatus;
  };

  const rows: Array<[string, SourceRow]> = [
    ...state.accounts.map((account): [string, SourceRow] => [account.institution, { name: account.institution, type: account.source, lastSyncAt: account.updatedAt }]),
    ...state.investments.map((investment): [string, SourceRow] => [investment.institution, { name: investment.institution, type: investment.source, lastSyncAt: investment.updatedAt }]),
    ...state.dataSources.map((source): [string, SourceRow] => [source.provider, { name: source.provider, type: source.type, lastSyncAt: source.lastSyncAt, dataUntil: source.dataUntil, status: source.status }]),
  ].filter(([name]) => Boolean(name));
  const institutions = Array.from(new Map<string, SourceRow>(rows).values());

  return (
    <div className="mt-4 divide-y divide-slate-100">
      {institutions.map((source) => {
        const status = source.status ?? (source.type === "manual" ? "updated" : "needs_update");
        const isUpdated = status === "updated" || status === "connected";
        const action = source.type === "csv" ? "Importar extrato" : source.type === "manual" ? "Atualizar manualmente" : "Futuro";
        return (
          <div key={source.name} className="flex flex-wrap items-center justify-between gap-3 py-3">
            <div>
              <p className="font-black text-slate-950">{source.name}</p>
              <p className="text-sm font-semibold text-slate-500">
                {source.lastSyncAt ? `Última atualização: ${formatDate(source.lastSyncAt)}` : source.dataUntil ? `Dados até: ${source.dataUntil}` : "Sem sincronização real"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-black ${isUpdated ? "bg-teal-50 text-teal-700" : "bg-amber-50 text-amber-700"}`}>
                {isUpdated ? "Atualizado" : "Requer atualização"}
              </span>
              {action === "Futuro" ? (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">Futuro</span>
              ) : (
                <a href={source.type === "csv" ? "/movimentos" : "/dinheiro"} className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">
                  {action}
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
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
