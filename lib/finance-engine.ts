import type {
  AccountType,
  AssetType,
  CategoryRecord,
  CategoryType,
  FinanceState,
  FinancialSummary,
  InvestmentType,
  LiabilityRecord,
  LiabilityType,
  NorteScore,
  TransactionRecord,
  TransactionType,
  WorkspaceType,
} from "@/types/finance";

export const euro = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
export const euroCents = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" });

export const defaultUserId = "user-diogo";
export const defaultWorkspaceId = "workspace-personal";
export const familyWorkspaceId = "workspace-family";
export const freelancerWorkspaceId = "workspace-freelancer";
const createdAt = "2026-08-11T09:00:00.000Z";

export const workspaceTypeLabels: Record<WorkspaceType, string> = {
  PERSONAL: "Pessoal",
  FAMILY: "Familia",
  FREELANCER: "Freelancer",
  BUSINESS: "Negocios",
};

export const accountTypes: AccountType[] = ["checking", "savings", "cash", "broker", "crypto", "other"];
export const transactionTypes: TransactionType[] = ["income", "expense", "transfer", "investment", "withdrawal"];
export const categoryTypes: CategoryType[] = transactionTypes;
export const assetTypes: AssetType[] = ["real_estate", "vehicle", "business", "valuables", "other"];
export const liabilityTypes: LiabilityType[] = ["mortgage", "personal_loan", "auto_loan", "credit_card", "other"];
export const investmentTypes: InvestmentType[] = ["ETF", "Stock", "Crypto", "Fund", "Bond", "Cash", "Other"];

export const accountTypeLabels: Record<AccountType, string> = {
  checking: "Conta corrente",
  savings: "Poupanca",
  cash: "Dinheiro",
  broker: "Corretora",
  crypto: "Cripto",
  other: "Outra conta",
};

export const ownershipTypeLabels = {
  personal: "Pessoal",
  shared: "Partilhada",
} as const;

export const transactionTypeLabels: Record<TransactionType, string> = {
  income: "Receita",
  expense: "Despesa",
  transfer: "Transferencia",
  investment: "Investimento",
  withdrawal: "Levantamento",
};

export const assetTypeLabels: Record<AssetType, string> = {
  real_estate: "Imovel",
  vehicle: "Veiculo",
  business: "Participacao em negocio",
  valuables: "Bens de valor",
  other: "Outro ativo",
};

export const liabilityTypeLabels: Record<LiabilityType, string> = {
  mortgage: "Credito habitacao",
  personal_loan: "Credito pessoal",
  auto_loan: "Credito automovel",
  credit_card: "Cartao de credito",
  other: "Outra divida",
};

export const investmentTypeLabels: Record<InvestmentType, string> = {
  ETF: "ETF",
  Stock: "Acao",
  Crypto: "Cripto",
  Fund: "Fundo",
  Bond: "Obrigacao",
  Cash: "Liquidez",
  Other: "Outro",
};

const baseCategories: Array<Omit<CategoryRecord, "workspaceId">> = [
  { id: "cat-salary", name: "Salario", type: "income", icon: "briefcase", color: "#10b981" },
  { id: "cat-professional-income", name: "Rendimentos profissionais", type: "income", icon: "building", color: "#0f766e" },
  { id: "cat-interest", name: "Juros", type: "income", icon: "percent", color: "#14b8a6" },
  { id: "cat-dividends", name: "Dividendos", type: "income", icon: "coins", color: "#22c55e" },
  { id: "cat-other-income", name: "Outros rendimentos", type: "income", icon: "plus", color: "#84cc16" },
  { id: "cat-housing", name: "Habitacao", type: "expense", icon: "home", color: "#6366f1" },
  { id: "cat-supermarket", name: "Supermercado", type: "expense", icon: "utensils", color: "#f59e0b" },
  { id: "cat-restaurants", name: "Restaurantes", type: "expense", icon: "receipt", color: "#fb7185" },
  { id: "cat-transport", name: "Transportes", type: "expense", icon: "car", color: "#2563eb" },
  { id: "cat-fuel", name: "Combustivel", type: "expense", icon: "fuel", color: "#0ea5e9" },
  { id: "cat-health", name: "Saude", type: "expense", icon: "heart", color: "#ef4444" },
  { id: "cat-insurance", name: "Seguros", type: "expense", icon: "shield", color: "#64748b" },
  { id: "cat-subscriptions", name: "Subscricoes", type: "expense", icon: "repeat", color: "#06b6d4" },
  { id: "cat-shopping", name: "Compras", type: "expense", icon: "bag", color: "#a855f7" },
  { id: "cat-entertainment", name: "Lazer", type: "expense", icon: "sparkles", color: "#8b5cf6" },
  { id: "cat-education", name: "Educacao", type: "expense", icon: "book", color: "#3b82f6" },
  { id: "cat-travel", name: "Viagens", type: "expense", icon: "plane", color: "#0891b2" },
  { id: "cat-taxes", name: "Impostos", type: "expense", icon: "landmark", color: "#475569" },
  { id: "cat-etf", name: "ETF", type: "investment", icon: "trending-up", color: "#6d28d9" },
  { id: "cat-stocks", name: "Acoes", type: "investment", icon: "line-chart", color: "#2563eb" },
  { id: "cat-crypto", name: "Cripto", type: "investment", icon: "bitcoin", color: "#f59e0b" },
  { id: "cat-funds", name: "Fundos", type: "investment", icon: "pie-chart", color: "#0f766e" },
  { id: "cat-bonds", name: "Obrigacoes", type: "investment", icon: "badge-euro", color: "#64748b" },
  { id: "cat-other-investments", name: "Outros investimentos", type: "investment", icon: "bar-chart", color: "#7c3aed" },
  { id: "cat-other", name: "Outros", type: "expense", icon: "tag", color: "#94a3b8" },
];

export const initialFinanceState: FinanceState = {
  users: [{ id: defaultUserId, email: "diogo@norteai.local", name: "Diogo", createdAt }],
  workspaces: [
    { id: defaultWorkspaceId, ownerId: defaultUserId, name: "Diogo Pessoal", type: "PERSONAL", createdAt },
    { id: familyWorkspaceId, ownerId: defaultUserId, name: "Familia", type: "FAMILY", createdAt },
    { id: freelancerWorkspaceId, ownerId: defaultUserId, name: "Diogo Freelancer", type: "FREELANCER", createdAt },
  ],
  activeWorkspaceId: defaultWorkspaceId,
  workspaceMembers: [
    { id: "member-diogo-personal", workspaceId: defaultWorkspaceId, userId: defaultUserId, name: "Diogo", email: "diogo@norteai.local", role: "owner", ownershipPercentage: 100, createdAt },
    { id: "member-diogo-family", workspaceId: familyWorkspaceId, userId: defaultUserId, name: "Diogo", email: "diogo@norteai.local", role: "owner", ownershipPercentage: 50, createdAt },
    { id: "member-family-partner", workspaceId: familyWorkspaceId, name: "Membro familiar", role: "member", ownershipPercentage: 50, createdAt },
    { id: "member-diogo-freelancer", workspaceId: freelancerWorkspaceId, userId: defaultUserId, name: "Diogo", email: "diogo@norteai.local", role: "owner", ownershipPercentage: 100, createdAt },
  ],
  accountOwnerships: [
    { id: "own-checking-diogo", workspaceId: defaultWorkspaceId, accountId: "acc-checking", memberId: "member-diogo-personal", ownershipPercentage: 100 },
    { id: "own-savings-diogo", workspaceId: defaultWorkspaceId, accountId: "acc-savings", memberId: "member-diogo-personal", ownershipPercentage: 100 },
    { id: "own-broker-diogo", workspaceId: defaultWorkspaceId, accountId: "acc-broker", memberId: "member-diogo-personal", ownershipPercentage: 100 },
    { id: "own-cash-diogo", workspaceId: defaultWorkspaceId, accountId: "acc-cash", memberId: "member-diogo-personal", ownershipPercentage: 100 },
  ],
  accounts: [
    { id: "acc-checking", workspaceId: defaultWorkspaceId, name: "Conta corrente", institution: "Millennium", accountType: "checking", balance: 8420, currency: "EUR", ownershipType: "personal", ownershipPercentage: 100, source: "manual", color: "#2563eb", icon: "card", createdAt, updatedAt: createdAt },
    { id: "acc-savings", workspaceId: defaultWorkspaceId, name: "Poupanca", institution: "Caixa Geral de Depositos", accountType: "savings", balance: 12000, currency: "EUR", ownershipType: "personal", ownershipPercentage: 100, source: "manual", color: "#10b981", icon: "piggy", createdAt, updatedAt: createdAt },
    { id: "acc-broker", workspaceId: defaultWorkspaceId, name: "Trade Republic", institution: "Trade Republic", accountType: "broker", balance: 96350, currency: "EUR", ownershipType: "personal", ownershipPercentage: 100, source: "manual", color: "#6d28d9", icon: "chart", createdAt, updatedAt: createdAt },
    { id: "acc-cash", workspaceId: defaultWorkspaceId, name: "Carteira", institution: "Manual", accountType: "cash", balance: 0, currency: "EUR", ownershipType: "personal", ownershipPercentage: 100, source: "manual", color: "#f59e0b", icon: "cash", createdAt, updatedAt: createdAt },
  ],
  categories: [defaultWorkspaceId, familyWorkspaceId, freelancerWorkspaceId].flatMap((workspaceId) => baseCategories.map((category) => ({ ...category, id: `${category.id}-${workspaceId}`, workspaceId }))),
  categoryRules: [
    { id: "rule-continente", workspaceId: defaultWorkspaceId, merchantKeyword: "Continente", categoryId: `cat-supermarket-${defaultWorkspaceId}` },
    { id: "rule-pingo-doce", workspaceId: defaultWorkspaceId, merchantKeyword: "Pingo Doce", categoryId: `cat-supermarket-${defaultWorkspaceId}` },
    { id: "rule-galp", workspaceId: defaultWorkspaceId, merchantKeyword: "Galp", categoryId: `cat-transport-${defaultWorkspaceId}` },
    { id: "rule-netflix", workspaceId: defaultWorkspaceId, merchantKeyword: "Netflix", categoryId: `cat-subscriptions-${defaultWorkspaceId}` },
    { id: "rule-uber", workspaceId: defaultWorkspaceId, merchantKeyword: "Uber", categoryId: `cat-transport-${defaultWorkspaceId}` },
    { id: "rule-amazon", workspaceId: defaultWorkspaceId, merchantKeyword: "Amazon", categoryId: `cat-shopping-${defaultWorkspaceId}` },
  ],
  transactions: [
    { id: "trx-salary", workspaceId: defaultWorkspaceId, accountId: "acc-checking", date: "2026-08-02", description: "Salario Agosto", merchant: "Salario", amount: 4200, currency: "EUR", type: "income", category: "Salario", source: "manual", categoryId: `cat-salary-${defaultWorkspaceId}`, createdAt, updatedAt: createdAt },
    { id: "trx-rent", workspaceId: defaultWorkspaceId, accountId: "acc-checking", date: "2026-08-03", description: "Renda", merchant: "Senhorio", amount: -1050, currency: "EUR", type: "expense", category: "Habitacao", source: "manual", categoryId: `cat-housing-${defaultWorkspaceId}`, createdAt, updatedAt: createdAt },
    { id: "trx-continente", workspaceId: defaultWorkspaceId, accountId: "acc-checking", date: "2026-08-04", description: "Compras supermercado", merchant: "Continente", amount: -85.4, currency: "EUR", type: "expense", category: "Supermercado", source: "manual", categoryId: `cat-supermarket-${defaultWorkspaceId}`, createdAt, updatedAt: createdAt },
    { id: "trx-galp", workspaceId: defaultWorkspaceId, accountId: "acc-checking", date: "2026-08-05", description: "Combustivel", merchant: "Galp", amount: -62.1, currency: "EUR", type: "expense", category: "Combustivel", source: "manual", categoryId: `cat-fuel-${defaultWorkspaceId}`, createdAt, updatedAt: createdAt },
    { id: "trx-netflix", workspaceId: defaultWorkspaceId, accountId: "acc-checking", date: "2026-08-06", description: "Streaming", merchant: "Netflix", amount: -15.99, currency: "EUR", type: "expense", category: "Subscricoes", source: "manual", categoryId: `cat-subscriptions-${defaultWorkspaceId}`, createdAt, updatedAt: createdAt },
    { id: "trx-amazon", workspaceId: defaultWorkspaceId, accountId: "acc-checking", date: "2026-08-07", description: "Compras online", merchant: "Amazon", amount: -128.5, currency: "EUR", type: "expense", category: "Compras", source: "manual", categoryId: `cat-shopping-${defaultWorkspaceId}`, createdAt, updatedAt: createdAt },
    { id: "trx-vwce", workspaceId: defaultWorkspaceId, accountId: "acc-broker", date: "2026-08-08", description: "Compra VWCE", merchant: "VWCE", amount: -500, currency: "EUR", type: "investment", category: "ETF", source: "manual", categoryId: `cat-etf-${defaultWorkspaceId}`, createdAt, updatedAt: createdAt },
  ],
  assets: [
    { id: "asset-home", workspaceId: defaultWorkspaceId, name: "Casa", type: "real_estate", value: 250000, currency: "EUR", ownershipType: "personal", ownershipPercentage: 100, valuationDate: "2026-08-01", description: "Habitacao propria" },
    { id: "asset-tesla", workspaceId: defaultWorkspaceId, name: "Tesla Model 3", type: "vehicle", value: 35000, currency: "EUR", ownershipType: "personal", ownershipPercentage: 100, valuationDate: "2026-08-01", description: "Valor estimado de mercado" },
  ],
  liabilities: [
    { id: "lia-mortgage", workspaceId: defaultWorkspaceId, name: "Credito habitacao", type: "mortgage", balance: 126000, monthlyPayment: 620, interestRate: 3.15, maturityDate: "2052-12-31", currency: "EUR" },
    { id: "lia-card", workspaceId: defaultWorkspaceId, name: "Cartao credito", type: "credit_card", balance: 850, monthlyPayment: 120, interestRate: 12.9, currency: "EUR" },
  ],
  investments: [
    { id: "inv-vwce", workspaceId: defaultWorkspaceId, accountId: "acc-broker", assetId: "asset-investments", ticker: "VWCE", name: "Vanguard FTSE All-World", type: "ETF", quantity: 405, averagePrice: 95.2, currentPrice: 105.8, currentValue: 42850, costBasis: 38556, source: "manual", updatedAt: createdAt, institution: "Trade Republic", currency: "EUR" },
    { id: "inv-sp500", workspaceId: defaultWorkspaceId, accountId: "acc-broker", assetId: "asset-investments", ticker: "SXR8", name: "iShares Core S&P500", type: "ETF", quantity: 46, averagePrice: 446, currentPrice: 528.26, currentValue: 24300, costBasis: 20516, source: "manual", updatedAt: createdAt, institution: "Trade Republic", currency: "EUR" },
    { id: "inv-europe", workspaceId: defaultWorkspaceId, accountId: "acc-broker", assetId: "asset-investments", ticker: "EXSA", name: "Europe ETF", type: "ETF", quantity: 260, averagePrice: 38.4, currentPrice: 43.08, currentValue: 11200, costBasis: 9984, source: "manual", updatedAt: createdAt, institution: "Trade Republic", currency: "EUR" },
    { id: "inv-apple", workspaceId: defaultWorkspaceId, accountId: "acc-broker", assetId: "asset-investments", ticker: "AAPL", name: "Apple", type: "Stock", quantity: 38, averagePrice: 170, currentPrice: 205.26, currentValue: 7800, costBasis: 6460, source: "manual", updatedAt: createdAt, institution: "Trade Republic", currency: "EUR" },
    { id: "inv-btc", workspaceId: defaultWorkspaceId, accountId: "acc-broker", assetId: "asset-investments", ticker: "BTC", name: "Bitcoin", type: "Crypto", quantity: 0.12, averagePrice: 52000, currentPrice: 70833.33, currentValue: 8500, costBasis: 6240, source: "manual", updatedAt: createdAt, institution: "Coinbase", currency: "EUR" },
  ],
  financialGoals: [
    { id: "goal-emergency", workspaceId: defaultWorkspaceId, name: "Fundo de emergencia", type: "safety", targetValue: 18000, currentValue: 12000, deadline: "2026-12-31", priority: "Alta", status: "Ativo" },
    { id: "goal-home", workspaceId: defaultWorkspaceId, name: "Amortizar credito", type: "debt", targetValue: 25000, currentValue: 8400, deadline: "2028-06-30", priority: "Media", status: "Ativo" },
  ],
  financialScores: [{ id: "score-initial", workspaceId: defaultWorkspaceId, score: 82, createdAt }],
  financialSnapshots: [
    { id: "snap-jan", workspaceId: defaultWorkspaceId, snapshotDate: "2026-01-31", snapshotType: "INITIAL", month: "Jan", netWorth: 112000, liquidAssets: 15000, income: 4000, expenses: 2600, savingsRate: 35, assets: 220000, liabilities: 108000, investmentValue: 72000, createdAt },
    { id: "snap-fev", workspaceId: defaultWorkspaceId, snapshotDate: "2026-02-28", snapshotType: "MONTHLY", month: "Fev", netWorth: 148500, liquidAssets: 17200, income: 4100, expenses: 2480, savingsRate: 39.5, assets: 254000, liabilities: 105500, investmentValue: 76000, createdAt },
    { id: "snap-mar", workspaceId: defaultWorkspaceId, snapshotDate: "2026-03-31", snapshotType: "MONTHLY", month: "Mar", netWorth: 165000, liquidAssets: 18600, income: 4200, expenses: 2550, savingsRate: 39.3, assets: 269000, liabilities: 104000, investmentValue: 81000, createdAt },
    { id: "snap-abr", workspaceId: defaultWorkspaceId, snapshotDate: "2026-04-30", snapshotType: "MONTHLY", month: "Abr", netWorth: 201500, liquidAssets: 19500, income: 4200, expenses: 2620, savingsRate: 37.6, assets: 304000, liabilities: 102500, investmentValue: 87500, createdAt },
    { id: "snap-mai", workspaceId: defaultWorkspaceId, snapshotDate: "2026-05-31", snapshotType: "MONTHLY", month: "Mai", netWorth: 224000, liquidAssets: 20420, income: 4300, expenses: 2510, savingsRate: 41.6, assets: 325000, liabilities: 101000, investmentValue: 91000, createdAt },
  ],
  dataSources: [
    { id: "ds-manual", workspaceId: defaultWorkspaceId, type: "manual", provider: "Manual", status: "updated", lastSyncAt: createdAt, dataUntil: "2026-08-11", createdAt },
    { id: "ds-csv", workspaceId: defaultWorkspaceId, type: "csv", provider: "CSV", status: "needs_update", dataUntil: "2026-07-31", createdAt },
    { id: "ds-google-drive", workspaceId: defaultWorkspaceId, type: "google_drive", provider: "Google Drive", status: "disconnected", createdAt },
  ],
};

const categoryNamePtById: Record<string, string> = Object.fromEntries(baseCategories.map((category) => [category.id, category.name]));

export function normalizeFinanceState(rawState: Partial<FinanceState> | FinanceState): FinanceState {
  const state = rawState as FinanceState;
  const users = state.users?.length ? state.users : initialFinanceState.users;
  const workspaces = (state.workspaces?.length ? state.workspaces : initialFinanceState.workspaces).map((workspace) => ({
    ...workspace,
    name: workspace.id === familyWorkspaceId ? "Familia" : workspace.name,
  }));
  const activeWorkspaceId = state.activeWorkspaceId && workspaces.some((workspace) => workspace.id === state.activeWorkspaceId) ? state.activeWorkspaceId : defaultWorkspaceId;
  const workspaceMembers = state.workspaceMembers?.length ? state.workspaceMembers : initialFinanceState.workspaceMembers;

  const categories = normalizeCategories(state.categories, workspaces.map((workspace) => workspace.id));
  const categoryMap = Object.fromEntries(categories.map((category) => [category.id, category]));

  return {
    ...initialFinanceState,
    ...state,
    users,
    workspaces,
    activeWorkspaceId,
    workspaceMembers,
    accounts: (state.accounts ?? []).map((account) => ({
      ...account,
      workspaceId: account.workspaceId ?? defaultWorkspaceId,
      accountType: normalizeAccountType(account.accountType as string),
      ownershipType: account.ownershipType ?? "personal",
      ownershipPercentage: clampPercentage(account.ownershipPercentage ?? (account.ownershipType === "shared" ? 50 : 100)),
      source: account.source ?? "manual",
      currency: account.currency ?? "EUR",
      color: account.color ?? "#6d28d9",
      icon: account.icon ?? "wallet",
      createdAt: account.createdAt ?? createdAt,
      updatedAt: account.updatedAt ?? account.createdAt ?? createdAt,
    })),
    accountOwnerships: state.accountOwnerships?.length ? state.accountOwnerships : initialFinanceState.accountOwnerships,
    categories,
    categoryRules: (state.categoryRules ?? []).map((rule) => ({ ...rule, workspaceId: rule.workspaceId ?? defaultWorkspaceId })),
    transactions: (state.transactions ?? []).map((transaction) => {
      const category = transaction.category ?? categoryMap[transaction.categoryId ?? ""]?.name ?? "Outros";
      return {
        ...transaction,
        workspaceId: transaction.workspaceId ?? defaultWorkspaceId,
        merchant: transaction.merchant || transaction.description,
        currency: transaction.currency ?? "EUR",
        category,
        source: transaction.source ?? "manual",
        createdAt: transaction.createdAt ?? createdAt,
        updatedAt: transaction.updatedAt ?? transaction.createdAt ?? createdAt,
      };
    }),
    assets: (state.assets ?? []).map((asset) => ({
      ...asset,
      workspaceId: asset.workspaceId ?? defaultWorkspaceId,
      type: normalizeAssetType(asset.type as string),
      currency: asset.currency ?? "EUR",
      ownershipType: asset.ownershipType ?? "personal",
      ownershipPercentage: clampPercentage(asset.ownershipPercentage ?? 100),
      valuationDate: asset.valuationDate ?? "2026-08-01",
    })),
    liabilities: (state.liabilities ?? []).map((liability) => normalizeLiability(liability)),
    investments: (state.investments ?? []).map((investment) => ({
      ...investment,
      workspaceId: investment.workspaceId ?? defaultWorkspaceId,
      type: normalizeInvestmentType(investment.type as string),
      institution: investment.institution ?? "Manual",
      currency: investment.currency ?? "EUR",
      costBasis: investment.costBasis ?? investment.quantity * investment.averagePrice,
      source: investment.source ?? "manual",
      updatedAt: investment.updatedAt ?? createdAt,
    })),
    financialGoals: state.financialGoals?.length ? state.financialGoals.map((goal) => ({ ...goal, workspaceId: goal.workspaceId ?? defaultWorkspaceId })) : initialFinanceState.financialGoals,
    financialScores: state.financialScores?.length ? state.financialScores.map((score) => ({ ...score, workspaceId: score.workspaceId ?? defaultWorkspaceId })) : initialFinanceState.financialScores,
    financialSnapshots: state.financialSnapshots?.length ? state.financialSnapshots.map((snapshot) => normalizeSnapshot(snapshot)) : initialFinanceState.financialSnapshots,
    dataSources: state.dataSources?.length ? state.dataSources.map((source) => ({ ...source, workspaceId: source.workspaceId ?? defaultWorkspaceId, status: normalizeDataSourceStatus(source.status as string), createdAt: source.createdAt ?? createdAt })) : initialFinanceState.dataSources,
  };
}

export function scopeFinanceState(state: FinanceState, workspaceId = state.activeWorkspaceId): FinanceState {
  return {
    ...state,
    accounts: (state.accounts ?? []).filter((item) => item.workspaceId === workspaceId),
    accountOwnerships: (state.accountOwnerships ?? []).filter((item) => item.workspaceId === workspaceId),
    categories: (state.categories ?? []).filter((item) => item.workspaceId === workspaceId),
    categoryRules: (state.categoryRules ?? []).filter((item) => item.workspaceId === workspaceId),
    transactions: (state.transactions ?? []).filter((item) => item.workspaceId === workspaceId),
    assets: (state.assets ?? []).filter((item) => item.workspaceId === workspaceId),
    liabilities: (state.liabilities ?? []).filter((item) => item.workspaceId === workspaceId),
    investments: (state.investments ?? []).filter((item) => item.workspaceId === workspaceId),
    financialGoals: (state.financialGoals ?? []).filter((item) => item.workspaceId === workspaceId),
    financialScores: (state.financialScores ?? []).filter((item) => item.workspaceId === workspaceId),
    financialSnapshots: (state.financialSnapshots ?? []).filter((item) => item.workspaceId === workspaceId),
    dataSources: (state.dataSources ?? []).filter((item) => item.workspaceId === workspaceId),
    workspaceMembers: (state.workspaceMembers ?? []).filter((item) => item.workspaceId === workspaceId),
  };
}

export function calculateSummary(state: FinanceState): FinancialSummary {
  const scoped = scopeFinanceState(state);
  const income = sum(scoped.transactions.filter((item) => item.type === "income").map((item) => item.amount));
  const expenses = Math.abs(sum(scoped.transactions.filter((item) => item.type === "expense").map((item) => item.amount)));
  const investmentContributions = Math.abs(sum(scoped.transactions.filter((item) => item.type === "investment").map((item) => item.amount)));
  const savings = income - expenses;
  const cashPosition = sum(scoped.accounts.filter((item) => ["checking", "savings", "cash"].includes(item.accountType)).map((item) => attributableValue(item.balance, item.ownershipPercentage)));
  const investmentAccounts = sum(scoped.accounts.filter((item) => ["broker", "crypto"].includes(item.accountType)).map((item) => attributableValue(item.balance, item.ownershipPercentage)));
  const investments = scoped.investments.length ? sum(scoped.investments.map((item) => item.currentValue)) : investmentAccounts;
  const nonPortfolioAssets = sum(scoped.assets.map((item) => attributableValue(item.value, item.ownershipPercentage)));
  const assets = cashPosition + investments + nonPortfolioAssets;
  const liabilities = sum(scoped.liabilities.map((item) => item.balance));
  const allocation = toPercentSlices(groupValues(scoped.investments, (item) => investmentTypeLabels[item.type], (item) => item.currentValue));
  const spendingCategories = toAmountSlices(groupValues(scoped.transactions.filter((item) => item.type === "expense"), (item) => item.category || categoryName(scoped, item.categoryId), (item) => Math.abs(item.amount))).sort((a, b) => b.value - a.value);

  return {
    income,
    expenses,
    savings,
    savingsRate: income ? Number(((savings / income) * 100).toFixed(1)) : null,
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
  const isDataSufficient = summary.income > 0 && summary.expenses > 0 && summary.assets > 0;
  if (!isDataSufficient || summary.savingsRate === null) {
    return {
      score: 0,
      classification: "Dados insuficientes",
      isDataSufficient: false,
      reason: "Completa receitas, despesas e patrimonio para calcular o Norte Score.",
      savingsRatePoints: 0,
      emergencyFundPoints: 0,
      debtRatioPoints: 0,
      diversificationPoints: 0,
      consistencyPoints: 0,
    };
  }

  const savingsRatePoints = Math.min(30, Math.max(0, Math.round((summary.savingsRate / 40) * 30)));
  const emergencyFundPoints = Math.min(20, Math.round((summary.cashPosition / Math.max(summary.expenses, 1) / 6) * 20));
  const debtRatioPoints = Math.max(0, Math.round(20 - (summary.liabilities / Math.max(summary.assets, 1)) * 40));
  const diversificationPoints = Math.min(20, summary.allocation.length * 5);
  const consistencyPoints = summary.income > 0 && summary.expenses > 0 ? 10 : 4;
  const score = Math.min(100, savingsRatePoints + emergencyFundPoints + debtRatioPoints + diversificationPoints + consistencyPoints);

  return {
    score,
    classification: score >= 90 ? "Excelente" : score >= 75 ? "Muito bom" : score >= 50 ? "Precisa de atencao" : "Critico",
    isDataSufficient: true,
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
  return state.categories.find((item) => item.id === categoryId)?.name ?? "Outros";
}

export function categoryValue(state: FinanceState, categoryId?: string) {
  return categoryName(state, categoryId);
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

  const batchId = `batch-${Date.now()}`;

  return lines.filter(Boolean).map((line, index) => {
    const cells = line.split(",").map((item) => item.trim());
    const amount = Number(cells[amountIndex].replace(",", "."));
    const merchant = cells[descriptionIndex];
    const categoryId = inferCategoryId(state, merchant);
    return {
      id: `csv-${Date.now()}-${index}`,
      workspaceId: state.activeWorkspaceId,
      accountId,
      date: cells[dateIndex],
      description: merchant,
      merchant,
      amount,
      currency: "EUR",
      type: amount > 0 ? "income" : "expense",
      category: categoryName(state, categoryId),
      source: "csv",
      externalReference: transactionFingerprint({ accountId, date: cells[dateIndex], description: merchant, amount }),
      importBatchId: batchId,
      categoryId,
      createdAt,
      updatedAt: createdAt,
    };
  });
}

export function transactionFingerprint(input: { accountId: string; date: string; description: string; amount: number }) {
  return `${input.accountId}|${input.date}|${Number(input.amount).toFixed(2)}|${normalizeText(input.description)}`;
}

export function isDuplicateTransaction(existing: TransactionRecord[], transaction: TransactionRecord) {
  const reference = transaction.externalReference ?? transactionFingerprint(transaction);
  return existing.some((item) => (item.externalReference ?? transactionFingerprint(item)) === reference);
}

function normalizeCategories(categories: CategoryRecord[] | undefined, workspaceIds: string[]) {
  const existing = (categories ?? []).map((category) => ({
    ...category,
    workspaceId: category.workspaceId ?? defaultWorkspaceId,
    name: categoryNamePtById[baseCategoryId(category.id)] ?? category.name,
  }));

  const missing = workspaceIds.flatMap((workspaceId) => {
    const existingForWorkspace = existing.filter((category) => category.workspaceId === workspaceId).map((category) => baseCategoryId(category.id));
    return baseCategories
      .filter((category) => !existingForWorkspace.includes(category.id))
      .map((category) => ({ ...category, id: `${category.id}-${workspaceId}`, workspaceId }));
  });

  return [...existing, ...missing];
}

function baseCategoryId(categoryId: string) {
  return baseCategories.find((category) => categoryId === category.id || categoryId.startsWith(`${category.id}-`))?.id ?? categoryId;
}

function normalizeAccountType(type: string): AccountType {
  if (type === "checking" || type === "bank_account") return "checking";
  if (type === "savings") return "savings";
  if (type === "broker" || type === "investment") return "broker";
  if (type === "crypto") return "crypto";
  if (type === "other" || type === "property") return "other";
  return "cash";
}

function normalizeAssetType(type: string): AssetType {
  if (type === "real_estate" || type === "property") return "real_estate";
  if (type === "vehicle") return "vehicle";
  if (type === "business") return "business";
  if (type === "valuables") return "valuables";
  return "other";
}

function normalizeInvestmentType(type: string): InvestmentType {
  if (type === "Stock") return "Stock";
  if (type === "Crypto") return "Crypto";
  if (type === "Fund") return "Fund";
  if (type === "Bond") return "Bond";
  if (type === "Cash") return "Cash";
  if (type === "Other") return "Other";
  return "ETF";
}

function normalizeLiability(liability: LiabilityRecord) {
  return {
    ...liability,
    workspaceId: liability.workspaceId ?? defaultWorkspaceId,
    balance: liability.balance ?? liability.amount ?? 0,
    currency: liability.currency ?? "EUR",
  };
}

function normalizeSnapshot(snapshot: FinanceState["financialSnapshots"][number]) {
  return {
    ...snapshot,
    workspaceId: snapshot.workspaceId ?? defaultWorkspaceId,
    snapshotDate: snapshot.snapshotDate ?? "2026-08-01",
    snapshotType: snapshot.snapshotType ?? "MONTHLY",
    liquidAssets: snapshot.liquidAssets ?? 0,
    savingsRate: snapshot.savingsRate ?? null,
    assets: snapshot.assets ?? snapshot.netWorth + (snapshot.liabilities ?? 0),
    liabilities: snapshot.liabilities ?? 0,
  };
}

function normalizeDataSourceStatus(status: string) {
  if (["connected", "updated", "needs_update", "processing", "error", "disconnected"].includes(status)) return status as FinanceState["dataSources"][number]["status"];
  if (status === "active") return "updated";
  if (status === "not_connected" || status === "paused") return "disconnected";
  return "disconnected";
}

function clampPercentage(value: number) {
  return Math.min(100, Math.max(0, Number.isFinite(value) ? value : 100));
}

function attributableValue(value: number, ownershipPercentage: number) {
  return value * (clampPercentage(ownershipPercentage) / 100);
}

function normalizeText(value: string) {
  return value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ");
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
