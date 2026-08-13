"use client";

import { useState } from "react";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { isSupabaseConfigured, supabase } from "@/lib/supabase-client";

export function AuthPage({ mode }: { mode: "login" | "register" }) {
  const isRegister = mode === "register";
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    if (!supabase) {
      setStatus("Supabase ainda não está configurado neste ambiente.");
      return;
    }

    setIsSubmitting(true);
    const redirectTo = getAuthRedirectUrl();
    const fullName = `${firstName} ${lastName}`.trim();

    const result = isRegister
      ? await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectTo,
            data: { name: fullName || email.split("@")[0] },
          },
        })
      : await supabase.auth.signInWithPassword({ email, password });

    setIsSubmitting(false);

    if (result.error) {
      setStatus(result.error.message);
      return;
    }

    if (isRegister && !result.data.session) {
      setStatus("Conta criada. Confirma o email para entrar.");
      return;
    }

    window.location.href = "/";
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg)] px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_460px]">
        <section className="hidden lg:block">
          <BrandMark />
          <h1 className="mt-10 max-w-xl text-6xl font-black leading-[1.02] tracking-normal text-slate-950">
            O teu copiloto financeiro inteligente.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            Une património, dinheiro, objetivos e inteligência financeira numa experiência simples e premium.
          </p>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
            {["Dados próprios", "Cálculos claros", "Privacidade"].map((item) => (
              <div key={item} className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
                <p className="font-black text-slate-950">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-100 sm:p-8">
          <div className="lg:hidden">
            <BrandMark />
          </div>
          <h2 className="mt-8 text-3xl font-black tracking-normal text-slate-950">
            {isRegister ? "Criar conta" : "Entrar"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {isRegister ? "Começa por criar a tua visão financeira pessoal." : "Acede ao teu espaço financeiro pessoal."}
          </p>
          <form className="mt-7 space-y-4" onSubmit={submitAuth}>
            {isRegister && (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="form-field">
                  <span>Nome</span>
                  <input value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder="Diogo" />
                </label>
                <label className="form-field">
                  <span>Apelido</span>
                  <input value={lastName} onChange={(event) => setLastName(event.target.value)} placeholder="Silva" />
                </label>
              </div>
            )}
            <label className="form-field">
              <span>Email</span>
              <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="diogo@norteai.pt" />
            </label>
            <label className="form-field">
              <span>Password</span>
              <input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" />
            </label>
            <button className="primary-button w-full" type="submit" disabled={isSubmitting || !isSupabaseConfigured}>
              {isSubmitting ? "A processar..." : isRegister ? "Criar conta" : "Entrar"}
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </form>
          {status ? <p className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-600">{status}</p> : null}
          <div className="mt-6 rounded-2xl bg-violet-50 p-4 text-sm leading-6 text-violet-900">
            <div className="flex items-center gap-2 font-black">
              <ShieldCheck size={17} aria-hidden="true" />
              <span>{isSupabaseConfigured ? "Autenticação Supabase ativa" : "Autenticação por configurar"}</span>
            </div>
            <p className="mt-1">Sessões seguras com onboarding automático de workspace pessoal.</p>
          </div>
          <p className="mt-6 text-center text-sm text-slate-600">
            {isRegister ? "Já tens conta?" : "Ainda não tens conta?"}{" "}
            <a className="font-black text-violet-700" href={isRegister ? "/login" : "/register"}>
              {isRegister ? "Entrar" : "Criar conta"}
            </a>
          </p>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
            <Mail size={14} aria-hidden="true" />
            NorteAI Pessoal
          </p>
        </section>
      </div>
    </main>
  );
}

function getAuthRedirectUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configuredUrl) return `${configuredUrl}/`;

  const isLocalhost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  if (isLocalhost) return "https://norteai.carlosanetopt.workers.dev/";

  return `${window.location.origin}/`;
}
