import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateNorteScore,
  calculateSummary,
  initialFinanceState,
  isDuplicateTransaction,
  parseCsv,
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
