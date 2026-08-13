"use client";

import { useMemo } from "react";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { GoalCard } from "@/components/GoalCard";
import { useFinanceState } from "@/hooks/use-finance-state";
import { confirmDeletion } from "@/lib/destructive-actions";

export function GoalsPage() {
  const { state, setState, activeWorkspace } = useFinanceState();
  const goals = state.financialGoals;
  const totalProgress = useMemo(() => {
    const current = goals.reduce((sum, goal) => sum + goal.currentValue, 0);
    const target = goals.reduce((sum, goal) => sum + goal.targetValue, 0);
    return target ? Math.round((current / target) * 100) : 0;
  }, [goals]);

  function addGoal() {
    if (!activeWorkspace) return;
    setState((current) => ({
      ...current,
      financialGoals: [
        ...current.financialGoals,
        {
          id: crypto.randomUUID(),
          workspaceId: activeWorkspace.id,
          name: "Novo objetivo",
          type: "outros",
          targetValue: 15000,
          currentValue: 2500,
          deadline: "2027-12-31",
          priority: "Média",
          status: "Ativo",
        },
      ],
    }));
  }

  return (
    <AppShell activePath="/goals">
      <div className="space-y-6">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="page-title">Objetivos</h1>
            <p className="page-subtitle">Metas financeiras guardadas localmente para validar criação e gestão de objetivos.</p>
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
              <GoalCard
                key={goal.id}
                goal={goal}
                onDelete={() => {
                  if (!confirmDeletion(goal.name)) return;
                  setState((current) => ({ ...current, financialGoals: current.financialGoals.filter((item) => item.id !== goal.id) }));
                }}
              />
            ))}
          </section>
        )}
      </div>
    </AppShell>
  );
}
