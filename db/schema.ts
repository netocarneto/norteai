import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  createdAt: text("created_at").notNull(),
});

export const workspaces = sqliteTable("workspaces", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  type: text("type", { enum: ["PERSONAL", "FAMILY", "FREELANCER", "BUSINESS"] }).notNull(),
  createdAt: text("created_at").notNull(),
});

export const workspaceMembers = sqliteTable("workspace_members", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull().references(() => workspaces.id),
  userId: text("user_id").references(() => users.id),
  name: text("name").notNull(),
  email: text("email"),
  role: text("role", { enum: ["owner", "member"] }).notNull(),
  ownershipPercentage: real("ownership_percentage"),
  createdAt: text("created_at").notNull(),
});

export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull().references(() => workspaces.id),
  name: text("name").notNull(),
  institution: text("institution").notNull(),
  type: text("type", { enum: ["checking", "savings", "cash", "broker", "crypto", "other"] }).notNull(),
  balance: real("balance").notNull(),
  currency: text("currency").notNull(),
  ownershipType: text("ownership_type", { enum: ["personal", "shared"] }).notNull(),
  ownershipPercentage: real("ownership_percentage").notNull(),
  source: text("source", { enum: ["manual", "csv", "google_drive", "open_banking", "broker_api"] }).notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const accountOwnerships = sqliteTable("account_ownerships", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull().references(() => workspaces.id),
  accountId: text("account_id").notNull().references(() => accounts.id),
  memberId: text("member_id").notNull().references(() => workspaceMembers.id),
  ownershipPercentage: real("ownership_percentage").notNull(),
});

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull().references(() => workspaces.id),
  name: text("name").notNull(),
  type: text("type", { enum: ["income", "expense", "transfer", "investment"] }).notNull(),
  color: text("color").notNull(),
});

export const categoryRules = sqliteTable("category_rules", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull().references(() => workspaces.id),
  merchantKeyword: text("merchant_keyword").notNull(),
  categoryId: text("category_id").notNull().references(() => categories.id),
});

export const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull().references(() => workspaces.id),
  accountId: text("account_id").notNull().references(() => accounts.id),
  date: text("date").notNull(),
  description: text("description").notNull(),
  merchant: text("merchant").notNull(),
  amount: real("amount").notNull(),
  currency: text("currency").notNull(),
  type: text("type", { enum: ["income", "expense", "transfer", "investment", "withdrawal"] }).notNull(),
  category: text("category").notNull(),
  categoryId: text("category_id").references(() => categories.id),
  notes: text("notes"),
  source: text("source", { enum: ["manual", "csv", "google_drive", "open_banking", "broker_api"] }).notNull(),
  externalReference: text("external_reference"),
  importBatchId: text("import_batch_id"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const investments = sqliteTable("investments", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull().references(() => workspaces.id),
  accountId: text("account_id").references(() => accounts.id),
  name: text("name").notNull(),
  type: text("type", { enum: ["ETF", "Stock", "Crypto", "Fund", "Bond", "Cash", "Other"] }).notNull(),
  ticker: text("ticker").notNull(),
  quantity: real("quantity").notNull(),
  averagePrice: real("average_price").notNull(),
  currentPrice: real("current_price"),
  currentValue: real("current_value").notNull(),
  costBasis: real("cost_basis").notNull(),
  institution: text("institution").notNull(),
  source: text("source", { enum: ["manual", "csv", "google_drive", "open_banking", "broker_api"] }).notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const assets = sqliteTable("assets", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull().references(() => workspaces.id),
  name: text("name").notNull(),
  type: text("type", { enum: ["real_estate", "vehicle", "business", "valuables", "other"] }).notNull(),
  value: real("value").notNull(),
  currency: text("currency").notNull(),
  ownershipType: text("ownership_type", { enum: ["personal", "shared"] }).notNull(),
  ownershipPercentage: real("ownership_percentage").notNull(),
  valuationDate: text("valuation_date").notNull(),
  notes: text("notes"),
});

export const liabilities = sqliteTable("liabilities", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull().references(() => workspaces.id),
  name: text("name").notNull(),
  balance: real("balance").notNull(),
  type: text("type", { enum: ["mortgage", "personal_loan", "auto_loan", "credit_card", "other"] }).notNull(),
  monthlyPayment: real("monthly_payment").notNull(),
  interestRate: real("interest_rate").notNull(),
  maturityDate: text("maturity_date"),
  currency: text("currency").notNull(),
});

export const financialGoals = sqliteTable("financial_goals", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull().references(() => workspaces.id),
  name: text("name").notNull(),
  targetValue: real("target_value").notNull(),
  currentValue: real("current_value").notNull(),
  deadline: text("deadline").notNull(),
});

export const financialScores = sqliteTable("financial_scores", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull().references(() => workspaces.id),
  score: integer("score").notNull(),
  createdAt: text("created_at").notNull(),
});

export const financialSnapshots = sqliteTable("financial_snapshots", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull().references(() => workspaces.id),
  snapshotDate: text("snapshot_date").notNull(),
  snapshotType: text("snapshot_type", { enum: ["INITIAL", "MONTHLY", "IMPORT_CORRECTION"] }).notNull(),
  month: text("month").notNull(),
  netWorth: real("net_worth").notNull(),
  liquidAssets: real("liquid_assets").notNull(),
  income: real("income").notNull(),
  expenses: real("expenses").notNull(),
  savingsRate: real("savings_rate"),
  assets: real("assets").notNull(),
  liabilities: real("liabilities").notNull(),
  investmentValue: real("investment_value").notNull(),
  createdAt: text("created_at").notNull(),
});

export const dataSources = sqliteTable("data_sources", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull().references(() => workspaces.id),
  type: text("type", { enum: ["manual", "csv", "google_drive", "open_banking", "broker_api"] }).notNull(),
  provider: text("provider").notNull(),
  status: text("status", { enum: ["connected", "updated", "needs_update", "processing", "error", "disconnected"] }).notNull(),
  lastSyncAt: text("last_sync_at"),
  dataUntil: text("data_until"),
  createdAt: text("created_at").notNull(),
});
