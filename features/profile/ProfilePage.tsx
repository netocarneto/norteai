"use client";

import { ShieldCheck, UserRound } from "lucide-react";
import type { ElementType } from "react";
import { AppShell } from "@/components/AppShell";
import { accountRows, user } from "@/lib/demo-data";

export function ProfilePage() {
  return (
    <AppShell activePath="/profile">
      <div className="space-y-6">
        <section>
          <h1 className="page-title">Perfil</h1>
          <p className="page-subtitle">Dados pessoais, perfil financeiro, risco e preferencias.</p>
        </section>
        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
            <div className="flex items-center gap-4">
              <div className="grid size-16 place-items-center rounded-3xl bg-violet-700 text-2xl font-black text-white">D</div>
              <div>
                <h2 className="text-2xl font-black text-slate-950">{user.firstName} {user.lastName}</h2>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-3">
              <ProfileRow label="Pais" value={user.country} />
              <ProfileRow label="Moeda" value={user.currency} />
              <ProfileRow label="Perfil de risco" value={user.riskProfile} />
              <ProfileRow label="Experiencia" value="Intermedia" />
            </div>
          </article>
          <article className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
            <h2 className="section-title">Perfil financeiro</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {accountRows.slice(0, 4).map((row) => {
                const Icon = row.icon;
                return (
                  <div key={row.label} className="rounded-2xl bg-slate-50 p-4">
                    <Icon size={20} className="text-violet-700" aria-hidden="true" />
                    <p className="mt-3 text-sm font-bold text-slate-500">{row.label}</p>
                    <p className="mt-1 text-xl font-black text-slate-950">{row.value}</p>
                  </div>
                );
              })}
            </div>
          </article>
        </section>
        <section className="grid gap-4 md:grid-cols-2">
          <InfoCard icon={UserRound} title="Dados pessoais" text="Nome, email, pais e moeda principal." />
          <InfoCard icon={ShieldCheck} title="Perfil de risco" text="Crescimento equilibrado com limites definidos no perfil." />
        </section>
      </div>
    </AppShell>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
      <span className="text-sm font-bold text-slate-500">{label}</span>
      <span className="font-black text-slate-950">{value}</span>
    </div>
  );
}

function InfoCard({ icon: Icon, title, text }: { icon: ElementType; title: string; text: string }) {
  return (
    <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
      <Icon size={22} className="text-violet-700" aria-hidden="true" />
      <h2 className="mt-4 font-black text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </article>
  );
}
