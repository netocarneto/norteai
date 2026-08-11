"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { GoalCard } from "@/components/GoalCard";
import { initialGoals } from "@/lib/demo-data";
import type { Goal } from "@/types/finance";

export function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const totalProgress = useMemo(() => {
    const current = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    const target = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    return target ? Math.round((current / target) * 100) : 0;
  }, [goals]);

  function addGoal() {
    setGoals((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name: "Novo objetivo",
        type: "other",
        targetAmount: 15000,
        currentAmount: 2500,
        targetDate: "2027-12-31",
        priority: "Media",
        status: "Ativo",
      },
    ]);
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="page-title">Objetivos</h1>
            <p className="page-subtitle">CRUD funcional em memoria para validar criacao e gestao de metas.</p>
          </div>
          <button onClick={addGoal} className="primary-button w-fit">
            <Plus size={18} aria-hidden="true" />
            Novo objetivo
          </button>
        </section>
        <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
          <p className="text-sm font-bold text-slate-500">Progresso total</p>
          <p className="mt-2 text-4xl font-black text-slate-950">{totalProgress}%</p>
          <div className="mt-4 h-3 rounded-full bg-slate-100">
            <div className="h-3 rounded-full bg-gradient-to-r from-teal-400 to-violet-600" style={{ width: `${Math.min(totalProgress, 100)}%` }} />
          </div>
        </article>
        {goals.length === 0 ? (
          <EmptyState title="Sem objetivos" description="Adiciona uma meta para o NorteAI acompanhar o teu caminho financeiro." />
        ) : (
          <section className="grid gap-4 lg:grid-cols-2">
            {goals.map((goal) => (
              <div key={goal.id} className="relative">
                <GoalCard goal={goal} />
                <button
                  onClick={() => setGoals((current) => current.filter((item) => item.id !== goal.id))}
                  className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-white text-slate-400 shadow-sm ring-1 ring-slate-200 hover:text-rose-600"
                  aria-label={`Eliminar ${goal.name}`}
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            ))}
          </section>
        )}
      </div>
    </AppShell>
  );
}
