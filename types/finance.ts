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
  priority: "Alta" | "Media" | "Baixa";
  status: "Ativo" | "Concluido" | "Pausado";
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

export type AccountType = "checking" | "savings" | "cash" | "broker" | "crypto" | "other";
export type TransactionType = "income" | "expense" | "transfer" | "investment";
export type CategoryType = TransactionType;
export type AssetType = "investment" | "real_estate" | "vehicle" | "business" | "cash" | "other";
export type LiabilityType = "mortgage" | "personal_loan" | "credit_card" | "other";
export type InvestmentType = "ETF" | "Stock" | "Crypto" | "Fund" | "Bond";

export type FinancialAccountRecord = {
  id: string;
  name: string;
  institution: string;
  accountType: AccountType;
  balance: number;
  currency: string;
  color: string;
  icon: string;
};

export type CategoryRecord = {
  id: string;
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
};

export type CategoryRuleRecord = {
  id: string;
  merchantKeyword: string;
  categoryId: string;
};

export type TransactionRecord = {
  id: string;
  accountId: string;
  date: string;
  description: string;
  merchant: string;
  amount: number;
  type: TransactionType;
  categoryId?: string;
  notes?: string;
};

export type AssetRecord = {
  id: string;
  name: string;
  type: AssetType;
  value: number;
  currency: string;
  description?: string;
};

export type LiabilityRecord = {
  id: string;
  name: string;
  type: LiabilityType;
  amount: number;
  monthlyPayment: number;
  interestRate: number;
};

export type InvestmentRecord = {
  id: string;
  assetId?: string;
  ticker: string;
  name: string;
  type: InvestmentType;
  quantity: number;
  averagePrice: number;
  currentValue: number;
  currency: string;
};

export type FinanceState = {
  accounts: FinancialAccountRecord[];
  categories: CategoryRecord[];
  categoryRules: CategoryRuleRecord[];
  transactions: TransactionRecord[];
  assets: AssetRecord[];
  liabilities: LiabilityRecord[];
  investments: InvestmentRecord[];
};

export type FinancialSummary = {
  income: number;
  expenses: number;
  savings: number;
  savingsRate: number;
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
  classification: "Excellent" | "Very good" | "Needs attention" | "Critical";
  savingsRatePoints: number;
  emergencyFundPoints: number;
  debtRatioPoints: number;
  diversificationPoints: number;
  consistencyPoints: number;
};
