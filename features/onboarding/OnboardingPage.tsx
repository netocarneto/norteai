"use client";

/* eslint-disable @next/next/no-html-link-for-pages */

import { useState } from "react";
import { ArrowRight, BadgeEuro, Goal, Shield, Sparkles, UserRound } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { useFinanceState } from "@/hooks/use-finance-state";

const steps = [
  { title: "Bem-vindo ao NorteAI", copy: "O teu copiloto financeiro inteligente.", icon: Sparkles },
  { title: "Informação pessoal", copy: "País, moeda e preferências para personalizar a experiência.", icon: UserRound },
  { title: "Perfil financeiro", copy: "Rendimento, poupança e experiência financeira.", icon: BadgeEuro },
  { title: "Objetivos", copy: "Casa, emergência, reforma ou investimentos.", icon: Goal },
  { title: "Perfil de risco", copy: "Conservador, equilibrado, crescimento ou agressivo.", icon: Shield },
];

export function OnboardingPage() {
  const { activateWorkspace, isRemoteBacked, isRemoteLoading, remoteError } = useFinanceState();
  const [isActivatingFreelancer, setIsActivatingFreelancer] = useState(false);

  async function handleActivateFreelancer() {
    setIsActivatingFreelancer(true);
    try {
      await activateWorkspace("FREELANCER");
      window.location.href = "/";
    } finally {
      setIsActivatingFreelancer(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg)] px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <BrandMark />
        <section className="mt-10 rounded-[2rem] bg-white p-6 shadow-soft ring-1 ring-slate-100 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-700">Onboarding</p>
              <h1 className="mt-4 text-4xl font-black leading-tight tracking-normal text-slate-950">
                Estamos prontos para criar o teu Norte financeiro.
              </h1>
              <p className="mt-4 leading-7 text-slate-600">
                Uma experiência premium em cinco passos para preparar o dashboard com dados financeiros iniciais e escolhas realistas.
              </p>
              <a href="/" className="primary-button mt-8 w-fit">
                Finalizar configuração
                <ArrowRight size={18} aria-hidden="true" />
              </a>
              <button
                type="button"
                className="mt-3 inline-flex w-fit items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-sm disabled:opacity-60"
                disabled={isRemoteLoading || isActivatingFreelancer}
                onClick={() => void handleActivateFreelancer()}
              >
                {isActivatingFreelancer ? "A ativar Freelancer..." : "Ativar Freelancer"}
                <ArrowRight size={18} aria-hidden="true" />
              </button>
              <p className="mt-3 rounded-2xl bg-slate-50 p-3 text-xs font-bold leading-5 text-slate-500">
                {isRemoteBacked ? "Cria um workspace Freelancer separado no Supabase." : "Sem sessão Supabase, ativa apenas o protótipo local."}
              </p>
              {remoteError ? <p className="mt-3 rounded-2xl bg-rose-50 p-3 text-xs font-bold leading-5 text-rose-700">{remoteError}</p> : null}
            </div>
            <div className="grid gap-3">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <article key={step.title} className="flex gap-4 rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-100">
                    <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white text-violet-700 shadow-sm">
                      <Icon size={21} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-400">Passo {index + 1}</p>
                      <h2 className="mt-1 font-black text-slate-950">{step.title}</h2>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{step.copy}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
