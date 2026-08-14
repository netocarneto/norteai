import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const migration = readFileSync(new URL("../supabase/migrations/20260812_personal_production_foundation.sql", import.meta.url), "utf8");
const supabaseStore = readFileSync(new URL("../lib/supabase-finance-store.ts", import.meta.url), "utf8");
const financeHook = readFileSync(new URL("../hooks/use-finance-state.ts", import.meta.url), "utf8");
const settingsPage = readFileSync(new URL("../features/profile/SettingsPage.tsx", import.meta.url), "utf8");
const onboardingPage = readFileSync(new URL("../features/onboarding/OnboardingPage.tsx", import.meta.url), "utf8");
const dashboardPage = readFileSync(new URL("../features/dashboard/DashboardPage.tsx", import.meta.url), "utf8");

const workspaceScopedTables = [
  "workspaces",
  "workspace_members",
  "accounts",
  "account_ownerships",
  "categories",
  "category_rules",
  "transactions",
  "assets",
  "liabilities",
  "investments",
  "financial_goals",
  "financial_scores",
  "financial_snapshots",
  "data_sources",
];

test("production schema enables RLS on every workspace-scoped financial table", () => {
  for (const table of ["profiles", ...workspaceScopedTables]) {
    assert.match(migration, new RegExp(`alter table public\\.${table} enable row level security;`));
  }
});

test("production RLS policies isolate financial data through workspace membership", () => {
  assert.match(migration, /returns boolean[\s\S]+from public\.workspace_members wm[\s\S]+wm\.user_id = auth\.uid\(\)/);
  for (const table of workspaceScopedTables.filter((table) => !["workspaces", "workspace_members"].includes(table))) {
    assert.match(migration, new RegExp(`create policy "${table}_workspace_access" on public\\.${table} for all using \\(public\\.user_can_access_workspace\\(workspace_id\\)\\) with check \\(public\\.user_can_access_workspace\\(workspace_id\\)\\);`));
  }
});

test("freelancer workspace can be provisioned remotely without injecting prototype data", () => {
  assert.match(supabaseStore, /export async function provisionWorkspace/);
  assert.match(supabaseStore, /type: Extract<WorkspaceType, "FREELANCER" \| "FAMILY">/);
  assert.match(supabaseStore, /const workspaceName = type === "FREELANCER" \? `\$\{displayName\} Freelancer` : "Família";/);
  assert.match(supabaseStore, /await upsertRows\(client, "data_sources", defaultDataSources\(workspaceId\)\.map\(dataSourceToDb\)\);/);
  assert.match(supabaseStore, /defaultCategories\(workspaceId, type\)/);
  assert.match(financeHook, /normalizeFinanceState\(remote, \{ seedPrototypeWorkspaces: false \}\)/);
  assert.match(financeHook, /normalizeFinanceState\(\{ \.\.\.remote, activeWorkspaceId: workspaceId \}, \{ seedPrototypeWorkspaces: false \}\)/);
});

test("freelancer product language is explicit in onboarding, dashboard, and settings", () => {
  assert.match(onboardingPage, /Ativar Freelancer/);
  assert.match(onboardingPage, /workspace Freelancer separado no Supabase/);
  assert.match(settingsPage, /Ligado ao Supabase: workspaces e dados financeiros usam isolamento por workspace/);
  assert.match(settingsPage, /dados financeiros usam Supabase quando existe sessão autenticada/);
  assert.doesNotMatch(settingsPage, /persistência em backend deve ficar/);
  assert.match(dashboardPage, /Norte Score profissional/);
  assert.match(dashboardPage, /Receita mensal/);
  assert.match(dashboardPage, /Dinheiro disponível/);
  assert.match(dashboardPage, /Património profissional/);
  assert.match(dashboardPage, /Obrigações/);
});
