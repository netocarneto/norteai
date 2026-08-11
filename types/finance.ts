import type { LucideIcon } from "lucide-react";

export type RiskProfile = "conservative" | "balanced" | "growth" | "aggressive";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type MetricTone = "blue" | "green" | "purple" | "amber" | "rose";

export type Metric = {
  label: string;
  value: string;
  caption: string;
  tone: MetricTone;
  trend: number[];
};

export type Insight = {
  title: string;
  description: string;
  tone: MetricTone;
  icon: LucideIcon;
};

export type Goal = {
  id: string;
  name: string;
  type: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  priority: "Alta" | "Media" | "Baixa";
  status: "Ativo" | "Concluido" | "Pausado";
};

export type Position = {
  name: string;
  type: string;
  value: number;
  performance: string;
};

export type Transaction = {
  merchant: string;
  account: string;
  amount: string;
  date: string;
  tone: "positive" | "negative";
};
