import type {
  AccountType,
  AssetType,
  CategoryType,
  FinanceState,
  FinancialSummary,
  InvestmentType,
  LiabilityType,
  NorteScore,
  TransactionRecord,
  TransactionType,
} from "@/types/finance";

export const euro = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
export const euroCents = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" });

export const accountTypes: AccountType[] = ["checking", "savings", "cash", "broker", "crypto", "other"];
export const transactionTypes: TransactionType[] = ["income", "expense", "transfer", "investment"];
export const categoryTypes: CategoryType[] = transactionTypes;
export const assetTypes: AssetType[] = ["investment", "real_estate", "vehicle", "business", "cash", "other"];
export const liabilityTypes: LiabilityType[] = ["mortgage", "personal_loan", "credit_card", "other"];
export const investmentTypes: InvestmentType[] = ["ETF", "Stock", "Crypto", "Fund", "Bond"];

export const initialFinanceState: FinanceState = {
  accounts: [
    { id: "acc-checking", name: "Conta corrente", institution: "Millennium", accountType: "checking", balance: 8420, currency: "EUR", color: "#2563eb", icon: "card" },
    { id: "acc-savings", name: "Poupanca", institution: "Caixa Geral de Depositos", accountType: "savings", balance: 12000, currency: "EUR", color: "#10b981", icon: "piggy" },
    { id: "acc-broker", name: "Trade Republic", institution: "Trade Republic", accountType: "broker", balance: 96350, currency: "EUR", color: "#6d28d9", icon: "chart" },
    { id: "acc-crypto", name: "Coinbase", institution: "Coinbase", accountType: "crypto", balance: 8500, currency: "EUR", color: "#f59e0b", icon: "crypto" },
  ],
  categories: [
    { id: "cat-salary", name: "Salary", type: "income", icon: "briefcase", color: "#10b981" },
    { id: "cat-business", name: "Business", type: "income", icon: "building", color: "#0f766e" },
    { id: "cat-housing", name: "Housing", type: "expense", icon: "home", color: "#6366f1" },
    { id: "cat-food", name: "Food", type: "expense", icon: "utensils", color: "#f59e0b" },
    { id: "cat-transport", name: "Transport", type: "expense", icon: "car", color: "#2563eb" },
    { id: "cat-restaurants", name: "Restaurants", type: "expense", icon: "receipt", color: "#fb7185" },
    { id: "cat-shopping", name: "Shopping", type: "expense", icon: "bag", color: "#a855f7" },
    { id: "cat-subscriptions", name: "Subscriptions", type: "expense", icon: "repeat", color: "#06b6d4" },
    { id: "cat-insurance", name: "Insurance", type: "expense", icon: "shield", color: "#64748b" },
    { id: "cat-health", name: "Health", type: "expense", icon: "heart", color: "#ef4444" },
    { id: "cat-entertainment", name: "Entertainment", type: "expense", icon: "sparkles", color: "#8b5cf6" },
    { id: "cat-investments", name: "Investments", type: "investment", icon: "trending-up", color: "#6d28d9" },
    { id: "cat-other", name: "Other", type: "expense", icon: "tag", color: "#94a3b8" },
  ],
  categoryRules: [
    { id: "rule-continente", merchantKeyword: "Continente", categoryId: "cat-food" },
    { id: "rule-galp", merchantKeyword: "Galp", categoryId: "cat-transport" },
    { id: "rule-netflix", merchantKeyword: "Netflix", categoryId: "cat-subscriptions" },
    { id: "rule-amazon", merchantKeyword: "Amazon", categoryId: "cat-shopping" },
  ],
  transactions: [
    { id: "trx-salary", accountId: "acc-checking", date: "2026-08-02", description: "Salario Agosto", merchant: "Salario", amount: 4200, type: "income", categoryId: "cat-salary" },
    { id: "trx-rent", accountId: "acc-checking", date: "2026-08-03", description: "Renda", merchant: "Senhorio", amount: -1050, type: "expense", categoryId: "cat-housing" },
    { id: "trx-continente", accountId: "acc-checking", date: "2026-08-04", description: "Compras supermercado", merchant: "Continente", amount: -85.4, type: "expense", categoryId: "cat-food" },
    { id: "trx-galp", accountId: "acc-checking", date: "2026-08-05", description: "Combustivel", merchant: "Galp", amount: -62.1, type: "expense", categoryId: "cat-transport" },
    { id: "trx-netflix", accountId: "acc-checking", date: "2026-08-06", description: "Streaming", merchant: "Netflix", amount: -15.99, type: "expense", categoryId: "cat-subscriptions" },
    { id: "trx-amazon", accountId: "acc-checking", date: "2026-08-07", description: "Compras online", merchant: "Amazon", amount: -128.5, type: "expense", categoryId: "cat-shopping" },
    { id: "trx-vwce", accountId: "acc-broker", date: "2026-08-08", description: "Compra VWCE", merchant: "VWCE", amount: -500, type: "investment", categoryId: "cat-investments" },
  ],
  assets: [
    { id: "asset-investments", name: "Investimentos", type: "investment", value: 96350, currency: "EUR", description: "Carteira ETF, acoes e cripto" },
    { id: "asset-home", name: "Casa", type: "real_estate", value: 250000, currency: "EUR", description: "Habitacao propria" },
    { id: "asset-tesla", name: "Tesla Model 3", type: "vehicle", value: 35000, currency: "EUR", description: "Valor estimado de mercado" },
  ],
  liabilities: [
    { id: "lia-mortgage", name: "Credito habitacao", type: "mortgage", amount: 126000, monthlyPayment: 620, interestRate: 3.15 },
    { id: "lia-card", name: "Cartao credito", type: "credit_card", amount: 850, monthlyPayment: 120, interestRate: 12.9 },
  ],
  investments: [
    { id: "inv-vwce", assetId: "asset-investments", ticker: "VWCE", name: "Vanguard FTSE All-World", type: "ETF", quantity: 405, averagePrice: 95.2, currentValue: 42850, currency: "EUR" },
    { id: "inv-sp500", assetId: "asset-investments", ticker: "SXR8", name: "iShares Core S&P500", type: "ETF", quantity: 46, averagePrice: 446, currentValue: 24300, currency: "EUR" },
    { id: "inv-europe", assetId: "asset-investments", ticker: "EXSA", name: "Europe ETF", type: "ETF", quantity: 260, averagePrice: 38.4, currentValue: 11200, currency: "EUR" },
    { id: "inv-apple", assetId: "asset-investments", ticker: "AAPL", name: "Apple", type: "Stock", quantity: 38, averagePrice: 170, currentValue: 7800, currency: "EUR" },
    { id: "inv-btc", assetId: "asset-investments", ticker: "BTC", name: "Bitcoin", type: "Crypto", quantity: 0.12, averagePrice: 52000, currentValue: 8500, currency: "EUR" },
  ],
};

export function calculateSummary(state: FinanceState): FinancialSummary {
  const income = sum(state.transactions.filter((item) => item.type === "income").map((item) => item.amount));
  const expenses = Math.abs(sum(state.transactions.filter((item) => item.type === "expense").map((item) => item.amount)));
  const investmentContributions = Math.abs(sum(state.transactions.filter((item) => item.type === "investment").map((item) => item.amount)));
  const savings = income - expenses - investmentContributions;
  const cashPosition = sum(state.accounts.filter((item) => ["checking", "savings", "cash"].includes(item.accountType)).map((item) => item.balance));
  const assets = cashPosition + sum(state.assets.map((item) => item.value));
  const liabilities = sum(state.liabilities.map((item) => item.amount));
  const investments = sum(state.investments.map((item) => item.currentValue));
  const allocation = toPercentSlices(groupValues(state.investments, (item) => item.type, (item) => item.currentValue));
  const spendingCategories = toAmountSlices(groupValues(state.transactions.filter((item) => item.type === "expense"), (item) => categoryName(state, item.categoryId), (item) => Math.abs(item.amount))).sort((a, b) => b.value - a.value);

  return {
    income,
    expenses,
    savings,
    savingsRate: income ? Number(((savings / income) * 100).toFixed(1)) : 0,
    assets,
    liabilities,
    netWorth: assets - liabilities,
    cashPosition,
    investments,
    investmentContributions,
    allocation,
    spendingCategories,
  };
}

export function calculateNorteScore(summary: FinancialSummary): NorteScore {
  const savingsRatePoints = Math.min(30, Math.max(0, Math.round((summary.savingsRate / 40) * 30)));
  const emergencyFundPoints = Math.min(20, Math.round((summary.cashPosition / Math.max(summary.expenses, 1) / 6) * 20));
  const debtRatioPoints = Math.max(0, Math.round(20 - (summary.liabilities / Math.max(summary.assets, 1)) * 40));
  const diversificationPoints = Math.min(20, summary.allocation.length * 5);
  const consistencyPoints = summary.income > 0 && summary.expenses > 0 ? 10 : 4;
  const score = Math.min(100, savingsRatePoints + emergencyFundPoints + debtRatioPoints + diversificationPoints + consistencyPoints);

  return {
    score,
    classification: score >= 90 ? "Excellent" : score >= 75 ? "Very good" : score >= 50 ? "Needs attention" : "Critical",
    savingsRatePoints,
    emergencyFundPoints,
    debtRatioPoints,
    diversificationPoints,
    consistencyPoints,
  };
}

export function inferCategoryId(state: FinanceState, merchant: string) {
  const rule = state.categoryRules.find((item) => merchant.toLowerCase().includes(item.merchantKeyword.toLowerCase()));
  return rule?.categoryId;
}

export function categoryName(state: FinanceState, categoryId?: string) {
  return state.categories.find((item) => item.id === categoryId)?.name ?? "Other";
}

export function accountName(state: FinanceState, accountId: string) {
  return state.accounts.find((item) => item.id === accountId)?.name ?? "Conta";
}

export function parseCsv(csvText: string, state: FinanceState, accountId: string): TransactionRecord[] {
  const [headerLine, ...lines] = csvText.trim().split(/\r?\n/);
  const headers = headerLine.split(",").map((item) => item.trim().toLowerCase());
  const dateIndex = headers.indexOf("date");
  const descriptionIndex = headers.indexOf("description");
  const amountIndex = headers.indexOf("amount");

  if (dateIndex < 0 || descriptionIndex < 0 || amountIndex < 0) return [];

  return lines.map((line, index) => {
    const cells = line.split(",").map((item) => item.trim());
    const amount = Number(cells[amountIndex].replace(",", "."));
    const merchant = cells[descriptionIndex];
    return {
      id: `csv-${Date.now()}-${index}`,
      accountId,
      date: cells[dateIndex],
      description: merchant,
      merchant,
      amount,
      type: amount > 0 ? "income" : "expense",
      categoryId: inferCategoryId(state, merchant),
    };
  });
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function groupValues<T>(items: T[], keyFn: (item: T) => string, valueFn: (item: T) => number) {
  return items.reduce<Record<string, number>>((groups, item) => {
    const key = keyFn(item);
    groups[key] = (groups[key] ?? 0) + valueFn(item);
    return groups;
  }, {});
}

function toPercentSlices(values: Record<string, number>) {
  const total = sum(Object.values(values));
  const colors = ["#6d28d9", "#0f766e", "#f59e0b", "#2563eb", "#e11d48"];
  return Object.entries(values).map(([name, value], index) => ({ name, value: total ? Number(((value / total) * 100).toFixed(1)) : 0, color: colors[index % colors.length] }));
}

function toAmountSlices(values: Record<string, number>) {
  const colors = ["#f59e0b", "#2563eb", "#06b6d4", "#a855f7", "#64748b"];
  return Object.entries(values).map(([name, value], index) => ({ name, value, color: colors[index % colors.length] }));
}
