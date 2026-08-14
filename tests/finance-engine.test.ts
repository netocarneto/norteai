import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateNorteScore,
  calculateSummary,
  defaultWorkspaceId,
  familyWorkspaceId,
  freelancerWorkspaceId,
  initialFinanceState,
  isDuplicateTransaction,
  markDataSourceUpdated,
  normalizeFinanceState,
  parseCsv,
  scopeFinanceState,
} from "../lib/finance-engine.ts";
import type { FinanceState } from "../types/finance.ts";

test("calculates the initial personal financial summary from registered data", () => {
  const summary = calculateSummary(initialFinanceState);

  assert.equal(summary.cashPosition, 20420);
  assert.equal(summary.investments, 94650);
  assert.equal(summary.assets, 400070);
  assert.equal(summary.liabilities, 126850);
  assert.equal(summary.netWorth, 273220);
  assert.equal(summary.income, 4200);
  assert.equal(summary.expenses, 1341.99);
  assert.equal(summary.savings, 2858.01);
  assert.equal(summary.savingsRate, 68);
  assert.equal(summary.investmentContributions, 500);
});

test("calculates Norte Score from financial factors, not hardcoded UI values", () => {
  const summary = calculateSummary(initialFinanceState);
  const score = calculateNorteScore(summary);

  assert.equal(score.score, 82);
  assert.equal(score.classification, "Muito bom");
  assert.equal(score.savingsRatePoints, 30);
  assert.equal(score.emergencyFundPoints, 20);
  assert.equal(score.debtRatioPoints, 7);
  assert.equal(score.diversificationPoints, 15);
  assert.equal(score.consistencyPoints, 10);
  assert.equal(score.isDataSufficient, true);
});

test("calculates family workspace summary independently from personal data", () => {
  const familyState = { ...initialFinanceState, activeWorkspaceId: familyWorkspaceId };
  const summary = calculateSummary(familyState);
  const score = calculateNorteScore(summary);

  assert.equal(summary.cashPosition, 23240);
  assert.equal(summary.assets, 308240);
  assert.equal(summary.liabilities, 148000);
  assert.equal(summary.netWorth, 160240);
  assert.equal(summary.income, 4000);
  assert.equal(Number(summary.expenses.toFixed(2)), 985.6);
  assert.equal(Number(summary.savings.toFixed(2)), 3014.4);
  assert.equal(summary.savingsRate, 75.4);
  assert.equal(score.score, 61);
  assert.equal(score.classification, "Precisa de atenção");
  assert.deepEqual(summary.spendingCategories.slice(0, 3).map((category) => category.name), ["Habitação", "Supermercado", "Educação"]);
});

test("calculates freelancer workspace summary independently from personal data", () => {
  const freelancerState = { ...initialFinanceState, activeWorkspaceId: freelancerWorkspaceId };
  const summary = calculateSummary(freelancerState);
  const score = calculateNorteScore(summary);

  assert.equal(summary.cashPosition, 8600);
  assert.equal(summary.assets, 26500);
  assert.equal(summary.liabilities, 3000);
  assert.equal(summary.netWorth, 23500);
  assert.equal(summary.income, 4150);
  assert.equal(summary.expenses, 389);
  assert.equal(summary.savings, 3761);
  assert.equal(summary.savingsRate, 90.6);
  assert.equal(score.score, 75);
  assert.equal(score.classification, "Muito bom");
  assert.deepEqual(summary.spendingCategories.slice(0, 3).map((category) => category.name), ["Outros", "Impostos", "Subscrições"]);
});

test("calculates freelancer professional patrimony from professional assets and liabilities", () => {
  const freelancer = scopeFinanceState({ ...initialFinanceState, activeWorkspaceId: freelancerWorkspaceId });
  const professionalAssets = freelancer.assets.reduce((total, asset) => total + asset.value * ((asset.ownershipPercentage ?? 100) / 100), 0);
  const professionalLiabilities = freelancer.liabilities.reduce((total, liability) => total + liability.balance, 0);

  assert.equal(professionalAssets, 26500);
  assert.equal(professionalLiabilities, 3000);
  assert.equal(professionalAssets - professionalLiabilities, 23500);
});

test("parses CSV imports with inferred categories and duplicate detection", () => {
  const [transaction] = parseCsv("date,description,amount\n2026-08-09,Continente,-42.30", initialFinanceState, "acc-checking");

  assert.equal(transaction.workspaceId, initialFinanceState.activeWorkspaceId);
  assert.equal(transaction.accountId, "acc-checking");
  assert.equal(transaction.description, "Continente");
  assert.equal(transaction.amount, -42.3);
  assert.equal(transaction.type, "expense");
  assert.equal(transaction.category, "Supermercado");
  assert.equal(isDuplicateTransaction([transaction], transaction), true);
});

test("marks CSV data source as updated after a manual import", () => {
  const initialCsv = initialFinanceState.dataSources.find((source) => source.type === "csv" && source.workspaceId === initialFinanceState.activeWorkspaceId);
  assert.equal(initialCsv?.status, "disconnected");

  const next = markDataSourceUpdated(initialFinanceState, {
    workspaceId: initialFinanceState.activeWorkspaceId,
    type: "csv",
    provider: "CSV",
    dataUntil: "2026-08-10",
    lastSyncAt: "2026-08-13T18:30:00.000Z",
  });
  const csv = next.dataSources.find((source) => source.type === "csv" && source.workspaceId === initialFinanceState.activeWorkspaceId);

  assert.equal(csv?.status, "updated");
  assert.equal(csv?.dataUntil, "2026-08-10");
  assert.equal(csv?.lastSyncAt, "2026-08-13T18:30:00.000Z");
});

test("migrates legacy unused CSV source from pending to optional", () => {
  const legacy = structuredClone(initialFinanceState);
  legacy.dataSources = legacy.dataSources.map((source) => source.type === "csv" ? { ...source, status: "needs_update", dataUntil: "2026-07-31" } : source);
  legacy.transactions = legacy.transactions.filter((transaction) => transaction.source !== "csv");

  const normalized = normalizeFinanceState(legacy);
  const csv = normalized.dataSources.find((source) => source.type === "csv" && source.workspaceId === normalized.activeWorkspaceId);

  assert.equal(csv?.status, "disconnected");
  assert.equal(csv?.dataUntil, undefined);
});

test("adds family seed records to legacy personal-only local states", () => {
  const legacy = structuredClone(initialFinanceState);
  legacy.accounts = legacy.accounts.filter((record) => record.workspaceId !== familyWorkspaceId);
  legacy.accountOwnerships = legacy.accountOwnerships.filter((record) => record.workspaceId !== familyWorkspaceId);
  legacy.transactions = legacy.transactions.filter((record) => record.workspaceId !== familyWorkspaceId);
  legacy.assets = legacy.assets.filter((record) => record.workspaceId !== familyWorkspaceId);
  legacy.liabilities = legacy.liabilities.filter((record) => record.workspaceId !== familyWorkspaceId);
  legacy.dataSources = legacy.dataSources.filter((record) => record.workspaceId !== familyWorkspaceId);

  const normalized = normalizeFinanceState(legacy);
  const family = scopeFinanceState({ ...normalized, activeWorkspaceId: familyWorkspaceId });

  assert.equal(family.accounts.length, 2);
  assert.equal(family.transactions.length, 6);
  assert.equal(family.assets.length, 1);
  assert.equal(family.liabilities.length, 1);
  assert.equal(family.dataSources.some((source) => source.type === "manual" && source.status === "updated"), true);
});

test("adds freelancer seed records to legacy personal-only local states", () => {
  const legacy = structuredClone(initialFinanceState);
  legacy.accounts = legacy.accounts.filter((record) => record.workspaceId !== freelancerWorkspaceId);
  legacy.accountOwnerships = legacy.accountOwnerships.filter((record) => record.workspaceId !== freelancerWorkspaceId);
  legacy.transactions = legacy.transactions.filter((record) => record.workspaceId !== freelancerWorkspaceId);
  legacy.assets = legacy.assets.filter((record) => record.workspaceId !== freelancerWorkspaceId);
  legacy.liabilities = legacy.liabilities.filter((record) => record.workspaceId !== freelancerWorkspaceId);
  legacy.dataSources = legacy.dataSources.filter((record) => record.workspaceId !== freelancerWorkspaceId);

  const normalized = normalizeFinanceState(legacy);
  const freelancer = scopeFinanceState({ ...normalized, activeWorkspaceId: freelancerWorkspaceId });

  assert.equal(freelancer.accounts.length, 2);
  assert.equal(freelancer.transactions.length, 5);
  assert.equal(freelancer.assets.length, 3);
  assert.equal(freelancer.liabilities.length, 1);
  assert.equal(freelancer.dataSources.some((source) => source.type === "manual" && source.status === "updated"), true);
});

test("does not inject prototype family or freelancer workspaces when normalizing remote Supabase state", () => {
  const personalOnly = {
    ...initialFinanceState,
    activeWorkspaceId: defaultWorkspaceId,
    workspaces: initialFinanceState.workspaces.filter((workspace) => workspace.id === defaultWorkspaceId),
    workspaceMembers: initialFinanceState.workspaceMembers.filter((record) => record.workspaceId === defaultWorkspaceId),
    accounts: initialFinanceState.accounts.filter((record) => record.workspaceId === defaultWorkspaceId),
    accountOwnerships: initialFinanceState.accountOwnerships.filter((record) => record.workspaceId === defaultWorkspaceId),
    categories: initialFinanceState.categories.filter((record) => record.workspaceId === defaultWorkspaceId),
    categoryRules: initialFinanceState.categoryRules.filter((record) => record.workspaceId === defaultWorkspaceId),
    transactions: initialFinanceState.transactions.filter((record) => record.workspaceId === defaultWorkspaceId),
    assets: initialFinanceState.assets.filter((record) => record.workspaceId === defaultWorkspaceId),
    liabilities: initialFinanceState.liabilities.filter((record) => record.workspaceId === defaultWorkspaceId),
    investments: initialFinanceState.investments.filter((record) => record.workspaceId === defaultWorkspaceId),
    financialGoals: initialFinanceState.financialGoals.filter((record) => record.workspaceId === defaultWorkspaceId),
    financialScores: initialFinanceState.financialScores.filter((record) => record.workspaceId === defaultWorkspaceId),
    financialSnapshots: initialFinanceState.financialSnapshots.filter((record) => record.workspaceId === defaultWorkspaceId),
    dataSources: initialFinanceState.dataSources.filter((record) => record.workspaceId === defaultWorkspaceId),
  };

  const normalized = normalizeFinanceState(personalOnly, { seedPrototypeWorkspaces: false });

  assert.deepEqual(normalized.workspaces.map((workspace) => workspace.type), ["PERSONAL"]);
  assert.equal(normalized.accounts.some((record) => record.workspaceId === freelancerWorkspaceId), false);
  assert.equal(normalized.transactions.some((record) => record.workspaceId === freelancerWorkspaceId), false);
});

test("keeps freelancer CRUD records isolated by freelancer workspace id", () => {
  const workspaceId = freelancerWorkspaceId;
  const accountId = "11111111-1111-4111-8111-111111111111";
  const transactionId = "22222222-2222-4222-8222-222222222222";
  const assetId = "33333333-3333-4333-8333-333333333333";
  const liabilityId = "44444444-4444-4444-8444-444444444444";
  const created: FinanceState = {
    ...initialFinanceState,
    activeWorkspaceId: workspaceId,
    accounts: [
      ...initialFinanceState.accounts,
      {
        id: accountId,
        workspaceId,
        name: "Conta teste freelancer",
        institution: "Banco profissional",
        accountType: "checking",
        balance: 1000,
        currency: "EUR",
        ownershipType: "personal",
        ownershipPercentage: 100,
        source: "manual",
        color: "#14b8a6",
        icon: "briefcase",
        createdAt: "2026-08-13T00:00:00.000Z",
        updatedAt: "2026-08-13T00:00:00.000Z",
      },
    ],
    transactions: [
      {
        id: transactionId,
        workspaceId,
        accountId,
        date: "2026-08-13",
        description: "Cliente teste",
        merchant: "Cliente teste",
        amount: 500,
        currency: "EUR",
        type: "income",
        category: "Rendimentos profissionais",
        source: "manual",
        createdAt: "2026-08-13T00:00:00.000Z",
        updatedAt: "2026-08-13T00:00:00.000Z",
      },
      ...initialFinanceState.transactions,
    ],
    assets: [
      ...initialFinanceState.assets,
      {
        id: assetId,
        workspaceId,
        name: "Ativo profissional teste",
        type: "valuables",
        value: 2500,
        currency: "EUR",
        ownershipType: "personal",
        ownershipPercentage: 100,
        valuationDate: "2026-08-13",
      },
    ],
    liabilities: [
      ...initialFinanceState.liabilities,
      {
        id: liabilityId,
        workspaceId,
        name: "Obrigação profissional teste",
        type: "personal_loan",
        balance: 300,
        monthlyPayment: 30,
        interestRate: 0,
        currency: "EUR",
      },
    ],
  };

  const freelancer = scopeFinanceState(created);
  assert.equal(freelancer.accounts.find((record) => record.id === accountId)?.workspaceId, workspaceId);
  assert.equal(freelancer.transactions.find((record) => record.id === transactionId)?.workspaceId, workspaceId);
  assert.equal(freelancer.assets.find((record) => record.id === assetId)?.workspaceId, workspaceId);
  assert.equal(freelancer.liabilities.find((record) => record.id === liabilityId)?.workspaceId, workspaceId);

  const deleted = scopeFinanceState({
    ...created,
    accounts: created.accounts.filter((record) => record.id !== accountId),
    transactions: created.transactions.filter((record) => record.id !== transactionId),
    assets: created.assets.filter((record) => record.id !== assetId),
    liabilities: created.liabilities.filter((record) => record.id !== liabilityId),
  });

  assert.equal(deleted.accounts.some((record) => record.id === accountId), false);
  assert.equal(deleted.transactions.some((record) => record.id === transactionId), false);
  assert.equal(deleted.assets.some((record) => record.id === assetId), false);
  assert.equal(deleted.liabilities.some((record) => record.id === liabilityId), false);
});
