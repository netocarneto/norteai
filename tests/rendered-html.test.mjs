import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders NorteAI dashboard shell", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /NorteAI Pessoal|NorteAI/);
  assert.match(html, /O teu copiloto financeiro inteligente/);
  assert.match(html, /Património líquido/);
  assert.match(html, /Norte Score|visão financeira atual/);
  assert.match(html, /Dinheiro/);
  assert.match(html, /Movimentos/);
  assert.doesNotMatch(html, /Your site is taking shape|codex-preview|react-loading-skeleton/);
});

test("keeps legacy routes as redirects to Portuguese routes", async () => {
  const redirects = new Map([
    ["/money", "/dinheiro"],
    ["/wealth", "/patrimonio"],
    ["/investments", "/investimentos"],
    ["/profile", "/definicoes"],
    ["/goals", "/objetivos"],
    ["/norteai", "/"],
  ]);

  for (const [from, to] of redirects) {
    const response = await render(from);
    assert.equal(response.status, 307);
    assert.equal(new URL(response.headers.get("location"), "http://localhost").pathname, to);
  }
});

test("declares installable PWA metadata", async () => {
  const [layout, manifest] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../public/manifest.webmanifest", import.meta.url), "utf8"),
  ]);

  assert.match(layout, /manifest:\s*"\/manifest\.webmanifest"/);
  assert.match(layout, /metadataBase:\s*new URL\("https:\/\/norteai\.carlosanetopt\.workers\.dev"\)/);
  assert.match(layout, /<html lang="pt-PT"/);
  assert.match(layout, /themeColor:\s*"#6d28d9"/);
  assert.equal(JSON.parse(manifest).display, "standalone");
});
