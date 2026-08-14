"use client";

import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createRecordId } from "@/lib/record-id";
import type {
  AccountOwnershipRecord,
  AssetRecord,
  CategoryRecord,
  CategoryRuleRecord,
  DataSourceRecord,
  FinanceState,
  FinancialAccountRecord,
  FinancialGoalRecord,
  FinancialScoreRecord,
  FinancialSnapshotRecord,
  InvestmentRecord,
  LiabilityRecord,
  LocalUserRecord,
  TransactionRecord,
  WorkspaceRecord,
  WorkspaceType,
  WorkspaceMemberRecord,
} from "@/types/finance";

type DbRow = Record<string, unknown>;

type SyncedTable =
  | "workspace_members"
  | "categories"
  | "accounts"
  | "account_ownerships"
  | "category_rules"
  | "transactions"
  | "assets"
  | "liabilities"
  | "investments"
  | "financial_goals"
  | "financial_scores"
  | "financial_snapshots"
  | "data_sources";

export async function loadFinanceStateFromSupabase(client: SupabaseClient): Promise<Partial<FinanceState>> {
  const { data: userResult, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  const user = userResult.user;
  if (!user) throw new Error("Sessão Supabase ausente.");

  const [
    profile,
    workspaces,
    workspaceMembers,
    accounts,
    accountOwnerships,
    categories,
    categoryRules,
    transactions,
    assets,
    liabilities,
    investments,
    financialGoals,
    financialScores,
    financialSnapshots,
    dataSources,
  ] = await Promise.all([
    selectRows(client, "profiles"),
    selectRows(client, "workspaces"),
    selectRows(client, "workspace_members"),
    selectRows(client, "accounts"),
    selectRows(client, "account_ownerships"),
    selectRows(client, "categories"),
    selectRows(client, "category_rules"),
    selectRows(client, "transactions"),
    selectRows(client, "assets"),
    selectRows(client, "liabilities"),
    selectRows(client, "investments"),
    selectRows(client, "financial_goals"),
    selectRows(client, "financial_scores"),
    selectRows(client, "financial_snapshots"),
    selectRows(client, "data_sources"),
  ]);

  return {
    users: profile.length ? profile.map(profileFromDb) : [userFromAuth(user)],
    workspaces: workspaces.map(workspaceFromDb),
    activeWorkspaceId: workspaces[0]?.id as string | undefined,
    workspaceMembers: workspaceMembers.map(workspaceMemberFromDb),
    accounts: accounts.map(accountFromDb),
    accountOwnerships: accountOwnerships.map(accountOwnershipFromDb),
    categories: categories.map(categoryFromDb),
    categoryRules: categoryRules.map(categoryRuleFromDb),
    transactions: transactions.map(transactionFromDb),
    assets: assets.map(assetFromDb),
    liabilities: liabilities.map(liabilityFromDb),
    investments: investments.map(investmentFromDb),
    financialGoals: financialGoals.map(financialGoalFromDb),
    financialScores: financialScores.map(financialScoreFromDb),
    financialSnapshots: financialSnapshots.map(financialSnapshotFromDb),
    dataSources: dataSources.map(dataSourceFromDb),
  };
}

export async function provisionWorkspace(client: SupabaseClient, type: Extract<WorkspaceType, "FREELANCER" | "FAMILY">, userName?: string) {
  const { data: userResult, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  const user = userResult.user;
  if (!user) throw new Error("Sessão Supabase ausente.");

  const existing = await selectRows(client, "workspaces");
  const found = existing.find((workspace) => workspace.type === type);
  if (found?.id) return String(found.id);

  const displayName = userName || user.user_metadata?.name || user.email?.split("@")[0] || "Utilizador";
  const workspaceName = type === "FREELANCER" ? `${displayName} Freelancer` : "Família";
  const { data: workspace, error: workspaceError } = await client
    .from("workspaces")
    .insert({ owner_id: user.id, name: workspaceName, type })
    .select("id")
    .single();
  if (workspaceError) throw workspaceError;

  const workspaceId = String(workspace.id);
  const { error: memberError } = await client.from("workspace_members").insert({
    workspace_id: workspaceId,
    user_id: user.id,
    name: displayName,
    email: user.email,
    role: "owner",
    ownership_percentage: 100,
  });
  if (memberError) throw memberError;

  await upsertRows(client, "data_sources", defaultDataSources(workspaceId).map(dataSourceToDb));
  await upsertRows(client, "categories", defaultCategories(workspaceId, type).map(categoryToDb));
  return workspaceId;
}

export async function persistWorkspaceToSupabase(client: SupabaseClient, state: FinanceState, workspaceId: string) {
  const workspace = state.workspaces.find((item) => item.id === workspaceId);
  if (!workspace || !isUuid(workspaceId)) return;

  const workspaceMembers = state.workspaceMembers.filter((item) => item.workspaceId === workspaceId && isUuid(item.id));
  const categories = state.categories.filter((item) => item.workspaceId === workspaceId && isUuid(item.id));
  const accounts = state.accounts.filter((item) => item.workspaceId === workspaceId && isUuid(item.id));
  const accountOwnerships = state.accountOwnerships.filter((item) => item.workspaceId === workspaceId && isUuid(item.id) && isUuid(item.accountId) && isUuid(item.memberId));
  const categoryRules = state.categoryRules.filter((item) => item.workspaceId === workspaceId && isUuid(item.id) && isUuid(item.categoryId));
  const transactions = state.transactions.filter((item) => item.workspaceId === workspaceId && isUuid(item.id) && isUuid(item.accountId));
  const assets = state.assets.filter((item) => item.workspaceId === workspaceId && isUuid(item.id));
  const liabilities = state.liabilities.filter((item) => item.workspaceId === workspaceId && isUuid(item.id));
  const investments = state.investments.filter((item) => item.workspaceId === workspaceId && isUuid(item.id));
  const financialGoals = state.financialGoals.filter((item) => item.workspaceId === workspaceId && isUuid(item.id));
  const financialScores = state.financialScores.filter((item) => item.workspaceId === workspaceId && isUuid(item.id));
  const financialSnapshots = state.financialSnapshots.filter((item) => item.workspaceId === workspaceId && isUuid(item.id));
  const dataSources = state.dataSources.filter((item) => item.workspaceId === workspaceId && isUuid(item.id));

  await deleteMissing(client, "account_ownerships", workspaceId, accountOwnerships.map((item) => item.id));
  await deleteMissing(client, "category_rules", workspaceId, categoryRules.map((item) => item.id));
  await deleteMissing(client, "transactions", workspaceId, transactions.map((item) => item.id));
  await deleteMissing(client, "investments", workspaceId, investments.map((item) => item.id));
  await deleteMissing(client, "financial_goals", workspaceId, financialGoals.map((item) => item.id));
  await deleteMissing(client, "financial_scores", workspaceId, financialScores.map((item) => item.id));
  await deleteMissing(client, "financial_snapshots", workspaceId, financialSnapshots.map((item) => item.id));
  await deleteMissing(client, "data_sources", workspaceId, dataSources.map((item) => item.id));
  await deleteMissing(client, "accounts", workspaceId, accounts.map((item) => item.id));
  await deleteMissing(client, "assets", workspaceId, assets.map((item) => item.id));
  await deleteMissing(client, "liabilities", workspaceId, liabilities.map((item) => item.id));
  await deleteMissing(client, "categories", workspaceId, categories.map((item) => item.id));

  await upsertRows(client, "workspace_members", workspaceMembers.map(workspaceMemberToDb));
  await upsertRows(client, "categories", categories.map(categoryToDb));
  await upsertRows(client, "accounts", accounts.map(accountToDb));
  await upsertRows(client, "assets", assets.map(assetToDb));
  await upsertRows(client, "liabilities", liabilities.map(liabilityToDb));
  await upsertRows(client, "data_sources", dataSources.map(dataSourceToDb));
  await upsertRows(client, "account_ownerships", accountOwnerships.map(accountOwnershipToDb));
  await upsertRows(client, "category_rules", categoryRules.map(categoryRuleToDb));
  await upsertRows(client, "investments", investments.map(investmentToDb));
  await upsertRows(client, "financial_goals", financialGoals.map(financialGoalToDb));
  await upsertRows(client, "financial_scores", financialScores.map(financialScoreToDb));
  await upsertRows(client, "financial_snapshots", financialSnapshots.map(financialSnapshotToDb));
  await upsertRows(client, "transactions", transactions.map(transactionToDb));
}

async function selectRows(client: SupabaseClient, table: string) {
  const { data, error } = await client.from(table).select("*");
  if (error) throw error;
  return (data ?? []) as DbRow[];
}

async function upsertRows(client: SupabaseClient, table: string, rows: DbRow[]) {
  if (!rows.length) return;
  const { error } = await client.from(table).upsert(rows);
  if (error) throw error;
}

async function deleteMissing(client: SupabaseClient, table: SyncedTable, workspaceId: string, ids: string[]) {
  const existing = await selectRows(client, table);
  const missingIds = existing
    .filter((row) => row.workspace_id === workspaceId)
    .map((row) => String(row.id))
    .filter((id) => !ids.includes(id));
  if (!missingIds.length) return;
  const { error } = await client.from(table).delete().in("id", missingIds);
  if (error) throw error;
}

function userFromAuth(user: User): LocalUserRecord {
  return { id: user.id, email: user.email ?? "", name: String(user.user_metadata?.name ?? user.email?.split("@")[0] ?? "Utilizador"), createdAt: user.created_at };
}

function profileFromDb(row: DbRow): LocalUserRecord {
  return { id: text(row.id), email: text(row.email), name: text(row.name), createdAt: text(row.created_at) };
}

function workspaceFromDb(row: DbRow): WorkspaceRecord {
  return { id: text(row.id), ownerId: text(row.owner_id), name: text(row.name), type: text(row.type) as WorkspaceType, createdAt: text(row.created_at) };
}

function workspaceMemberFromDb(row: DbRow): WorkspaceMemberRecord {
  return { id: text(row.id), workspaceId: text(row.workspace_id), userId: optionalText(row.user_id), name: text(row.name), email: optionalText(row.email), role: text(row.role) as WorkspaceMemberRecord["role"], ownershipPercentage: optionalNumber(row.ownership_percentage), createdAt: text(row.created_at) };
}

function accountFromDb(row: DbRow): FinancialAccountRecord {
  return { id: text(row.id), workspaceId: text(row.workspace_id), name: text(row.name), institution: text(row.institution), accountType: text(row.type) as FinancialAccountRecord["accountType"], balance: number(row.balance), currency: text(row.currency), ownershipType: text(row.ownership_type) as FinancialAccountRecord["ownershipType"], ownershipPercentage: number(row.ownership_percentage), source: text(row.source) as FinancialAccountRecord["source"], color: text(row.color, "#6d28d9"), icon: text(row.icon, "card"), createdAt: text(row.created_at), updatedAt: text(row.updated_at) };
}

function accountOwnershipFromDb(row: DbRow): AccountOwnershipRecord {
  return { id: text(row.id), workspaceId: text(row.workspace_id), accountId: text(row.account_id), memberId: text(row.member_id), ownershipPercentage: number(row.ownership_percentage) };
}

function categoryFromDb(row: DbRow): CategoryRecord {
  return { id: text(row.id), workspaceId: text(row.workspace_id), name: text(row.name), type: text(row.type) as CategoryRecord["type"], icon: text(row.icon, "tag"), color: text(row.color, "#6d28d9") };
}

function categoryRuleFromDb(row: DbRow): CategoryRuleRecord {
  return { id: text(row.id), workspaceId: text(row.workspace_id), merchantKeyword: text(row.merchant_keyword), categoryId: text(row.category_id) };
}

function transactionFromDb(row: DbRow): TransactionRecord {
  return { id: text(row.id), workspaceId: text(row.workspace_id), accountId: text(row.account_id), date: text(row.date), description: text(row.description), merchant: text(row.merchant), amount: number(row.amount), currency: text(row.currency), type: text(row.type) as TransactionRecord["type"], category: text(row.category), categoryId: optionalText(row.category_id), notes: optionalText(row.notes), source: text(row.source) as TransactionRecord["source"], externalReference: optionalText(row.external_reference), importBatchId: optionalText(row.import_batch_id), createdAt: text(row.created_at), updatedAt: text(row.updated_at) };
}

function assetFromDb(row: DbRow): AssetRecord {
  return { id: text(row.id), workspaceId: text(row.workspace_id), name: text(row.name), type: text(row.type) as AssetRecord["type"], value: number(row.value), currency: text(row.currency), ownershipType: text(row.ownership_type) as AssetRecord["ownershipType"], ownershipPercentage: number(row.ownership_percentage), valuationDate: text(row.valuation_date), notes: optionalText(row.notes), description: optionalText(row.notes) };
}

function liabilityFromDb(row: DbRow): LiabilityRecord {
  return { id: text(row.id), workspaceId: text(row.workspace_id), name: text(row.name), type: text(row.type) as LiabilityRecord["type"], balance: number(row.balance), monthlyPayment: number(row.monthly_payment), interestRate: number(row.interest_rate), maturityDate: optionalText(row.maturity_date), currency: text(row.currency) };
}

function investmentFromDb(row: DbRow): InvestmentRecord {
  return { id: text(row.id), workspaceId: text(row.workspace_id), accountId: optionalText(row.account_id), ticker: text(row.ticker), name: text(row.name), type: text(row.type) as InvestmentRecord["type"], quantity: number(row.quantity), averagePrice: number(row.average_price), currentPrice: optionalNumber(row.current_price), currentValue: number(row.current_value), costBasis: number(row.cost_basis), institution: text(row.institution), source: text(row.source) as InvestmentRecord["source"], updatedAt: text(row.updated_at), currency: text(row.currency) };
}

function financialGoalFromDb(row: DbRow): FinancialGoalRecord {
  return { id: text(row.id), workspaceId: text(row.workspace_id), name: text(row.name), targetValue: number(row.target_value), currentValue: number(row.current_value), deadline: text(row.deadline), type: text(row.type, "outros"), priority: text(row.priority, "Media") as FinancialGoalRecord["priority"], status: text(row.status, "Ativo") as FinancialGoalRecord["status"] };
}

function financialScoreFromDb(row: DbRow): FinancialScoreRecord {
  return { id: text(row.id), workspaceId: text(row.workspace_id), score: number(row.score), createdAt: text(row.created_at) };
}

function financialSnapshotFromDb(row: DbRow): FinancialSnapshotRecord {
  return { id: text(row.id), workspaceId: text(row.workspace_id), snapshotDate: text(row.snapshot_date), snapshotType: text(row.snapshot_type) as FinancialSnapshotRecord["snapshotType"], month: text(row.month), netWorth: number(row.net_worth), liquidAssets: number(row.liquid_assets), income: number(row.income), expenses: number(row.expenses), savingsRate: optionalNumber(row.savings_rate) ?? null, assets: number(row.assets), liabilities: number(row.liabilities), investmentValue: number(row.investment_value), createdAt: text(row.created_at) };
}

function dataSourceFromDb(row: DbRow): DataSourceRecord {
  return { id: text(row.id), workspaceId: text(row.workspace_id), type: text(row.type) as DataSourceRecord["type"], provider: text(row.provider), status: text(row.status) as DataSourceRecord["status"], lastSyncAt: optionalText(row.last_sync_at), dataUntil: optionalText(row.data_until), createdAt: text(row.created_at) };
}

function workspaceMemberToDb(item: WorkspaceMemberRecord): DbRow {
  return { id: item.id, workspace_id: item.workspaceId, user_id: item.userId ?? null, name: item.name, email: item.email ?? null, role: item.role, ownership_percentage: item.ownershipPercentage ?? null, created_at: item.createdAt };
}

function accountToDb(item: FinancialAccountRecord): DbRow {
  return { id: item.id, workspace_id: item.workspaceId, name: item.name, institution: item.institution, type: item.accountType, balance: item.balance, currency: item.currency, ownership_type: item.ownershipType, ownership_percentage: item.ownershipPercentage, source: item.source, color: item.color, icon: item.icon, created_at: item.createdAt, updated_at: item.updatedAt };
}

function accountOwnershipToDb(item: AccountOwnershipRecord): DbRow {
  return { id: item.id, workspace_id: item.workspaceId, account_id: item.accountId, member_id: item.memberId, ownership_percentage: item.ownershipPercentage };
}

function categoryToDb(item: CategoryRecord): DbRow {
  return { id: item.id, workspace_id: item.workspaceId, name: item.name, type: item.type, icon: item.icon, color: item.color };
}

function categoryRuleToDb(item: CategoryRuleRecord): DbRow {
  return { id: item.id, workspace_id: item.workspaceId, merchant_keyword: item.merchantKeyword, category_id: item.categoryId };
}

function transactionToDb(item: TransactionRecord): DbRow {
  return { id: item.id, workspace_id: item.workspaceId, account_id: item.accountId, date: item.date, description: item.description, merchant: item.merchant, amount: item.amount, currency: item.currency, type: item.type, category: item.category, category_id: item.categoryId || null, notes: item.notes || null, source: item.source, external_reference: item.externalReference || null, import_batch_id: item.importBatchId || null, created_at: item.createdAt, updated_at: item.updatedAt };
}

function assetToDb(item: AssetRecord): DbRow {
  return { id: item.id, workspace_id: item.workspaceId, name: item.name, type: item.type, value: item.value, currency: item.currency, ownership_type: item.ownershipType, ownership_percentage: item.ownershipPercentage, valuation_date: item.valuationDate, notes: item.notes ?? item.description ?? null };
}

function liabilityToDb(item: LiabilityRecord): DbRow {
  return { id: item.id, workspace_id: item.workspaceId, name: item.name, type: item.type, balance: item.balance, monthly_payment: item.monthlyPayment, interest_rate: item.interestRate, maturity_date: item.maturityDate || null, currency: item.currency };
}

function investmentToDb(item: InvestmentRecord): DbRow {
  return { id: item.id, workspace_id: item.workspaceId, account_id: item.accountId || null, ticker: item.ticker, name: item.name, type: item.type, quantity: item.quantity, average_price: item.averagePrice, current_price: item.currentPrice ?? null, current_value: item.currentValue, cost_basis: item.costBasis, institution: item.institution, source: item.source, updated_at: item.updatedAt, currency: item.currency };
}

function financialGoalToDb(item: FinancialGoalRecord): DbRow {
  return { id: item.id, workspace_id: item.workspaceId, name: item.name, target_value: item.targetValue, current_value: item.currentValue, deadline: item.deadline, type: item.type, priority: item.priority, status: item.status };
}

function financialScoreToDb(item: FinancialScoreRecord): DbRow {
  return { id: item.id, workspace_id: item.workspaceId, score: item.score, created_at: item.createdAt };
}

function financialSnapshotToDb(item: FinancialSnapshotRecord): DbRow {
  return { id: item.id, workspace_id: item.workspaceId, snapshot_date: item.snapshotDate, snapshot_type: item.snapshotType, month: item.month, net_worth: item.netWorth, liquid_assets: item.liquidAssets, income: item.income, expenses: item.expenses, savings_rate: item.savingsRate, assets: item.assets, liabilities: item.liabilities, investment_value: item.investmentValue, created_at: item.createdAt };
}

function dataSourceToDb(item: DataSourceRecord): DbRow {
  return { id: item.id, workspace_id: item.workspaceId, type: item.type, provider: item.provider, status: item.status, last_sync_at: item.lastSyncAt ?? null, data_until: item.dataUntil ?? null, created_at: item.createdAt };
}

function defaultDataSources(workspaceId: string): DataSourceRecord[] {
  const now = new Date().toISOString();
  return [
    { id: createRecordId(), workspaceId, type: "manual", provider: "Manual", status: "updated", lastSyncAt: now, dataUntil: now.slice(0, 10), createdAt: now },
    { id: createRecordId(), workspaceId, type: "csv", provider: "CSV", status: "disconnected", createdAt: now },
    { id: createRecordId(), workspaceId, type: "google_drive", provider: "Google Drive", status: "disconnected", createdAt: now },
  ];
}

function defaultCategories(workspaceId: string, type: WorkspaceType): CategoryRecord[] {
  const common: Array<Omit<CategoryRecord, "id" | "workspaceId">> = [
    { name: "Rendimentos profissionais", type: "income", icon: "briefcase", color: "#0f766e" },
    { name: "Impostos", type: "expense", icon: "landmark", color: "#f59e0b" },
    { name: "Subscrições", type: "expense", icon: "repeat", color: "#06b6d4" },
    { name: "Outros", type: "expense", icon: "tag", color: "#94a3b8" },
  ];
  const freelancer: Array<Omit<CategoryRecord, "id" | "workspaceId">> = [
    { name: "Software", type: "expense", icon: "app-window", color: "#6d28d9" },
    { name: "Contabilidade", type: "expense", icon: "receipt", color: "#2563eb" },
    { name: "Cowork", type: "expense", icon: "building", color: "#14b8a6" },
    { name: "Fornecedores", type: "expense", icon: "truck", color: "#64748b" },
    { name: "Equipamento", type: "expense", icon: "laptop", color: "#7c3aed" },
  ];
  return [...common, ...(type === "FREELANCER" ? freelancer : [])].map((category) => ({ ...category, id: createRecordId(), workspaceId }));
}

function text(value: unknown, fallback = "") {
  if (value === null || value === undefined) return fallback;
  return String(value);
}

function optionalText(value: unknown) {
  if (value === null || value === undefined) return undefined;
  return String(value);
}

function number(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function optionalNumber(value: unknown) {
  if (value === null || value === undefined) return undefined;
  return number(value);
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
