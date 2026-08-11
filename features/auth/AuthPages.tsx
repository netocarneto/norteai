import { ArrowRight, Mail, ShieldCheck } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";

export function AuthPage({ mode }: { mode: "login" | "register" }) {
  const isRegister = mode === "register";

  return (
    <main className="min-h-screen bg-[var(--color-bg)] px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_460px]">
        <section className="hidden lg:block">
          <BrandMark />
          <h1 className="mt-10 max-w-xl text-6xl font-black leading-[1.02] tracking-normal text-slate-950">
            O teu copiloto financeiro inteligente.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            Une patrimonio, dinheiro, objetivos e inteligencia financeira numa experiencia simples e premium.
          </p>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
            {["Score 84", "Poupanca 34%", "+8,2% ano"].map((item) => (
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
            {isRegister ? "Comeca com dados demo e termina no onboarding." : "Acede ao prototipo com a conta demo de Diogo."}
          </p>
          <form className="mt-7 space-y-4">
            {isRegister && (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="form-field">
                  <span>Nome</span>
                  <input placeholder="Diogo" />
                </label>
                <label className="form-field">
                  <span>Apelido</span>
                  <input placeholder="Silva" />
                </label>
              </div>
            )}
            <label className="form-field">
              <span>Email</span>
              <input type="email" placeholder="diogo@norteai.pt" />
            </label>
            <label className="form-field">
              <span>Password</span>
              <input type="password" placeholder="••••••••" />
            </label>
            <a href={isRegister ? "/onboarding" : "/"} className="primary-button">
              {isRegister ? "Criar conta" : "Entrar"}
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </form>
          <div className="mt-6 rounded-2xl bg-violet-50 p-4 text-sm leading-6 text-violet-900">
            <div className="flex items-center gap-2 font-black">
              <ShieldCheck size={17} aria-hidden="true" />
              <span>Autenticacao Stage 0</span>
            </div>
            <p className="mt-1">JWT/session segura preparada na arquitetura; sem dados reais nesta fase.</p>
          </div>
          <p className="mt-6 text-center text-sm text-slate-600">
            {isRegister ? "Ja tens conta?" : "Ainda nao tens conta?"}{" "}
            <a className="font-black text-violet-700" href={isRegister ? "/login" : "/register"}>
              {isRegister ? "Entrar" : "Criar conta"}
            </a>
          </p>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
            <Mail size={14} aria-hidden="true" />
            Demo only
          </p>
        </section>
      </div>
    </main>
  );
}
