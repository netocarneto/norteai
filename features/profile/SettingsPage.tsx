"use client";

import { useEffect, useRef, useState, type ElementType } from "react";
import { Database, FileSpreadsheet, Globe2, HardDrive, Landmark, LineChart, LogOut, UserRound, UsersRound } from "lucide-react";
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

const settingsStorageKey = "norteai-personal-settings";
const defaultProfile = { name: "Diogo", email: "diogo@norteai.pt", currency: "EUR", country: "Portugal" };
const defaultPreferences = { theme: "Sistema", language: "Português de Portugal", dateFormat: "DD/MM/AAAA" };
type StoredSettings = Partial<{ profile: typeof defaultProfile; preferences: typeof defaultPreferences }>;

export function SettingsPage() {
  const { state, activeWorkspace, workspaces, setActiveWorkspace } = useFinanceState();
  const [profile, setProfile] = useState(defaultProfile);
  const [preferences, setPreferences] = useState(defaultPreferences);
  const hasLoadedSettings = useRef(false);

  useEffect(() => {
    window.queueMicrotask(() => {
      const stored = readStoredSettings();
      setProfile({ ...defaultProfile, ...stored.profile });
      setPreferences({ ...defaultPreferences, ...stored.preferences });
      hasLoadedSettings.current = true;
    });
  }, []);

  useEffect(() => {
    if (!hasLoadedSettings.current) return;
    window.localStorage.setItem(settingsStorageKey, JSON.stringify({ profile, preferences }));
  }, [preferences, profile]);

  return (
    <AppShell activePath="/definicoes">
      <div className="space-y-6">
        <section>
          <h1 className="page-title">Definições</h1>
          <p className="page-subtitle">Perfil, preferências, fontes de dados, segurança e informação do produto.</p>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
          <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
            <div className="flex items-center gap-2">
              <UserRound size={20} className="text-violet-700" aria-hidden="true" />
              <h2 className="section-title">Perfil</h2>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="form-field">
                <span>Nome</span>
                <input value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} />
              </label>
              <label className="form-field">
                <span>Email</span>
                <input type="email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} />
              </label>
              <label className="form-field">
                <span>País</span>
                <input value={profile.country} onChange={(event) => setProfile({ ...profile, country: event.target.value })} />
              </label>
              <label className="form-field">
                <span>Moeda</span>
                <select value={profile.currency} onChange={(event) => setProfile({ ...profile, currency: event.target.value })}>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="USD">Dólar americano (USD)</option>
                  <option value="GBP">Libra esterlina (GBP)</option>
                </select>
              </label>
            </div>
            <p className="mt-4 rounded-2xl bg-slate-50 p-3 text-xs font-bold leading-5 text-slate-500">
              Guardado automaticamente neste dispositivo. A persistência em backend deve ficar para a fase Supabase completa.
            </p>
          </article>

          <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
            <div className="flex items-center gap-2">
              <Globe2 size={20} className="text-violet-700" aria-hidden="true" />
              <h2 className="section-title">Preferências</h2>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="form-field">
                <span>Tema</span>
                <select value={preferences.theme} onChange={(event) => setPreferences({ ...preferences, theme: event.target.value })}>
                  <option>Sistema</option>
                  <option>Claro</option>
                  <option>Escuro</option>
                </select>
              </label>
              <label className="form-field">
                <span>Idioma</span>
                <select value={preferences.language} onChange={(event) => setPreferences({ ...preferences, language: event.target.value })}>
                  <option>Português de Portugal</option>
                </select>
              </label>
              <label className="form-field">
                <span>Formato de data</span>
                <select value={preferences.dateFormat} onChange={(event) => setPreferences({ ...preferences, dateFormat: event.target.value })}>
                  <option>DD/MM/AAAA</option>
                  <option>AAAA-MM-DD</option>
                </select>
              </label>
            </div>
            <p className="mt-4 rounded-2xl bg-slate-50 p-3 text-xs font-bold leading-5 text-slate-500">
              Guardado automaticamente neste dispositivo.
            </p>
          </article>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
          <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
            <div className="flex items-center gap-2">
              <UsersRound size={20} className="text-violet-700" aria-hidden="true" />
              <h2 className="section-title">Workspaces</h2>
            </div>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
              O NorteAI Pessoal está fechado. O workspace Família tem MVP funcional e o Freelancer continua reservado para uma fase futura.
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
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">{workspace.type === "FAMILY" ? "MVP" : "Preparado"}</span>
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

function readStoredSettings(): StoredSettings {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(settingsStorageKey);
  if (!raw) return {};

  try {
    return JSON.parse(raw) as StoredSettings;
  } catch {
    return {};
  }
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
  const hasCsvImports = state.transactions.some((transaction) => transaction.source === "csv");

  return (
    <div className="mt-4 divide-y divide-slate-100">
      {institutions.map((source) => {
        const status = source.status ?? (source.type === "manual" ? "updated" : "needs_update");
        const isUpdated = status === "updated" || status === "connected";
        const isOptional = status === "disconnected" || (source.type === "csv" && !hasCsvImports && status === "needs_update");
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
              <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-black ${isUpdated ? "bg-teal-50 text-teal-700" : isOptional ? "bg-slate-100 text-slate-500" : "bg-amber-50 text-amber-700"}`}>
                {isUpdated ? "Atualizado" : isOptional ? "Opcional" : "Requer atualização"}
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
