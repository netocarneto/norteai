import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateNorteScore,
  calculateSummary,
  familyWorkspaceId,
  freelancerWorkspaceId,
  initialFinanceState,
  isDuplicateTransaction,
  markDataSourceUpdated,
  normalizeFinanceState,
  parseCsv,
  scopeFinanceState,
} from "../lib/finance-engine.ts";

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
});

test("calculates freelancer workspace summary independently from personal data", () => {
  const freelancerState = { ...initialFinanceState, activeWorkspaceId: freelancerWorkspaceId };
  const summary = calculateSummary(freelancerState);
  const score = calculateNorteScore(summary);

  assert.equal(summary.cashPosition, 8600);
  assert.equal(summary.assets, 8600);
  assert.equal(summary.liabilities, 0);
  assert.equal(summary.netWorth, 8600);
  assert.equal(summary.income, 4150);
  assert.equal(summary.expenses, 389);
  assert.equal(summary.savings, 3761);
  assert.equal(summary.savingsRate, 90.6);
  assert.equal(score.score, 80);
  assert.equal(score.classification, "Muito bom");
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
  legacy.dataSources = legacy.dataSources.filter((record) => record.workspaceId !== freelancerWorkspaceId);

  const normalized = normalizeFinanceState(legacy);
  const freelancer = scopeFinanceState({ ...normalized, activeWorkspaceId: freelancerWorkspaceId });

  assert.equal(freelancer.accounts.length, 2);
  assert.equal(freelancer.transactions.length, 5);
  assert.equal(freelancer.dataSources.some((source) => source.type === "manual" && source.status === "updated"), true);
});
