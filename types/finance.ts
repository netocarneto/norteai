import type { LucideIcon } from "lucide-react";

export type RiskProfile = "conservative" | "balanced" | "growth" | "aggressive";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type MetricTone = "blue" | "green" | "purple" | "amber" | "rose";

export type Metric = {
  label: string;
  value: string;
  caption: string;
  tone: MetricTone;
  trend: number[];
};

export type Insight = {
  title: string;
  description: string;
  tone: MetricTone;
  icon: LucideIcon;
};

export type Goal = {
  id: string;
  name: string;
  type: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  priority: "Alta" | "Média" | "Media" | "Baixa";
  status: "Ativo" | "Concluído" | "Concluido" | "Pausado";
};

export type Position = {
  name: string;
  type: string;
  value: number;
  performance: string;
};

export type Transaction = {
  merchant: string;
  account: string;
  amount: string;
  date: string;
  tone: "positive" | "negative";
};

export type WorkspaceType = "PERSONAL" | "FAMILY" | "FREELANCER" | "BUSINESS";
export type WorkspaceRole = "owner" | "member";
export type AccountType = "checking" | "savings" | "cash" | "broker" | "crypto" | "other";
export type OwnershipType = "personal" | "shared";
export type TransactionType = "income" | "expense" | "transfer" | "investment" | "withdrawal";
export type CategoryType = TransactionType;
export type AssetType = "real_estate" | "vehicle" | "business" | "valuables" | "other";
export type LiabilityType = "mortgage" | "personal_loan" | "auto_loan" | "credit_card" | "other";
export type InvestmentType = "ETF" | "Stock" | "Crypto" | "Fund" | "Bond" | "Cash" | "Other";
export type DataSourceType = "manual" | "csv" | "google_drive" | "open_banking" | "broker_api";
export type DataSourceStatus = "connected" | "updated" | "needs_update" | "processing" | "error" | "disconnected";

export type LocalUserRecord = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
};

export type WorkspaceRecord = {
  id: string;
  ownerId: string;
  name: string;
  type: WorkspaceType;
  createdAt: string;
};

export type WorkspaceMemberRecord = {
  id: string;
  workspaceId: string;
  userId?: string;
  name: string;
  email?: string;
  role: WorkspaceRole;
  ownershipPercentage?: number;
  createdAt: string;
};

export type FinancialAccountRecord = {
  id: string;
  workspaceId: string;
  name: string;
  institution: string;
  accountType: AccountType;
  balance: number;
  currency: string;
  ownershipType: OwnershipType;
  ownershipPercentage: number;
  source: DataSourceType;
  color: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
};

export type AccountOwnershipRecord = {
  id: string;
  workspaceId: string;
  accountId: string;
  memberId: string;
  ownershipPercentage: number;
};

export type CategoryRecord = {
  id: string;
  workspaceId: string;
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
};

export type CategoryRuleRecord = {
  id: string;
  workspaceId: string;
  merchantKeyword: string;
  categoryId: string;
};

export type TransactionRecord = {
  id: string;
  workspaceId: string;
  accountId: string;
  date: string;
  description: string;
  merchant: string;
  amount: number;
  currency: string;
  type: TransactionType;
  category: string;
  source: DataSourceType;
  externalReference?: string;
  importBatchId?: string;
  categoryId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type AssetRecord = {
  id: string;
  workspaceId: string;
  name: string;
  type: AssetType;
  value: number;
  currency: string;
  ownershipType: OwnershipType;
  ownershipPercentage: number;
  valuationDate: string;
  notes?: string;
  description?: string;
};

export type LiabilityRecord = {
  id: string;
  workspaceId: string;
  name: string;
  type: LiabilityType;
  balance: number;
  monthlyPayment: number;
  interestRate: number;
  maturityDate?: string;
  currency: string;
  amount?: number;
};

export type InvestmentRecord = {
  id: string;
  workspaceId: string;
  accountId?: string;
  assetId?: string;
  ticker: string;
  name: string;
  type: InvestmentType;
  quantity: number;
  averagePrice: number;
  currentPrice?: number;
  currentValue: number;
  costBasis: number;
  source: DataSourceType;
  updatedAt: string;
  institution: string;
  currency: string;
};

export type FinancialGoalRecord = {
  id: string;
  workspaceId: string;
  name: string;
  targetValue: number;
  currentValue: number;
  deadline: string;
  type: string;
  priority: "Alta" | "Média" | "Media" | "Baixa";
  status: "Ativo" | "Concluído" | "Concluido" | "Pausado";
};

export type FinancialScoreRecord = {
  id: string;
  workspaceId: string;
  score: number;
  createdAt: string;
};

export type FinancialSnapshotRecord = {
  id: string;
  workspaceId: string;
  snapshotDate: string;
  snapshotType: "INITIAL" | "MONTHLY" | "IMPORT_CORRECTION";
  month: string;
  netWorth: number;
  liquidAssets: number;
  income: number;
  expenses: number;
  savingsRate: number | null;
  assets: number;
  liabilities: number;
  investmentValue: number;
  createdAt: string;
};

export type DataSourceRecord = {
  id: string;
  workspaceId: string;
  type: DataSourceType;
  provider: string;
  status: DataSourceStatus;
  lastSyncAt?: string;
  dataUntil?: string;
  createdAt: string;
};

export type FinanceState = {
  users: LocalUserRecord[];
  workspaces: WorkspaceRecord[];
  activeWorkspaceId: string;
  workspaceMembers: WorkspaceMemberRecord[];
  accountOwnerships: AccountOwnershipRecord[];
  accounts: FinancialAccountRecord[];
  categories: CategoryRecord[];
  categoryRules: CategoryRuleRecord[];
  transactions: TransactionRecord[];
  assets: AssetRecord[];
  liabilities: LiabilityRecord[];
  investments: InvestmentRecord[];
  financialGoals: FinancialGoalRecord[];
  financialScores: FinancialScoreRecord[];
  financialSnapshots: FinancialSnapshotRecord[];
  dataSources: DataSourceRecord[];
};

export type FinancialSummary = {
  income: number;
  expenses: number;
  savings: number;
  savingsRate: number | null;
  assets: number;
  liabilities: number;
  netWorth: number;
  cashPosition: number;
  investments: number;
  investmentContributions: number;
  allocation: { name: string; value: number; color: string }[];
  spendingCategories: { name: string; value: number; color: string }[];
};

export type NorteScore = {
  score: number;
  classification: "Excelente" | "Muito bom" | "Precisa de atenção" | "Precisa de atencao" | "Crítico" | "Critico" | "Dados insuficientes";
  isDataSufficient: boolean;
  reason?: string;
  savingsRatePoints: number;
  emergencyFundPoints: number;
  debtRatioPoints: number;
  diversificationPoints: number;
  consistencyPoints: number;
};
