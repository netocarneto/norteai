import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const dashboard = readFileSync(new URL("../features/dashboard/DashboardPage.tsx", import.meta.url), "utf8");
const patrimonio = readFileSync(new URL("../features/finance/WealthStageOnePage.tsx", import.meta.url), "utf8");
const movimentos = readFileSync(new URL("../features/finance/TransactionsPage.tsx", import.meta.url), "utf8");
const investir = readFileSync(new URL("../features/investments/InvestmentsPage.tsx", import.meta.url), "utf8");

test("freelancer and family dashboards keep Norte Score as a wide first card on desktop", () => {
  assert.match(dashboard, /<NorteScoreCard className="xl:col-span-2" score=\{score\} title="Norte Score familiar"/);
  assert.match(dashboard, /<NorteScoreCard className="xl:col-span-2" score=\{score\} title="Norte Score profissional"/);
  assert.match(dashboard, /min-\[390px\]:grid-cols-2 lg:gap-5 xl:grid-cols-4/);
});

test("freelancer critical pages use responsive grids instead of fixed-width rows", () => {
  assert.match(patrimonio, /grid gap-4 md:grid-cols-2 xl:grid-cols-4/);
  assert.match(patrimonio, /grid gap-5 xl:grid-cols-\[1fr_1fr\]/);
  assert.match(movimentos, /xl:grid-cols-\[minmax\(0,0\.95fr\)_minmax\(0,1\.4fr\)\]/);
  assert.match(movimentos, /2xl:grid-cols-\[minmax\(180px,1fr\)_130px_150px_150px_130px\]/);
  assert.match(investir, /grid gap-5 lg:grid-cols-\[1fr_1fr\] xl:grid-cols-\[1fr_1fr_0\.9fr\]/);
  assert.match(investir, /mt-5 grid gap-4 sm:grid-cols-2/);
});
