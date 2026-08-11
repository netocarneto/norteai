"use client";

/* eslint-disable @next/next/no-html-link-for-pages */

import { ArrowRight, BadgeEuro, Goal, Shield, Sparkles, UserRound } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";

const steps = [
  { title: "Bem-vindo ao NorteAI", copy: "O teu copiloto financeiro inteligente.", icon: Sparkles },
  { title: "Informacao pessoal", copy: "Pais, moeda e preferencias para personalizar a experiencia.", icon: UserRound },
  { title: "Perfil financeiro", copy: "Rendimento, poupanca e experiencia financeira.", icon: BadgeEuro },
  { title: "Objetivos", copy: "Casa, emergencia, reforma ou investimentos.", icon: Goal },
  { title: "Perfil de risco", copy: "Conservador, balanced, growth ou aggressive.", icon: Shield },
];

export function OnboardingPage() {
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
                Uma experiencia premium em cinco passos para preparar o dashboard com dados demo e escolhas realistas.
              </p>
              <a href="/" className="primary-button mt-8 w-fit">
                Finalizar demo
                <ArrowRight size={18} aria-hidden="true" />
              </a>
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
                      <p className="text-xs font-black text-slate-400">Step {index + 1}</p>
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
