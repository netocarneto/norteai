import {
  ArrowDownUp,
  Banknote,
  BriefcaseBusiness,
  Car,
  ChartNoAxesCombined,
  CircleDollarSign,
  CreditCard,
  ListTree,
  Goal as GoalIcon,
  Home,
  Landmark,
  PiggyBank,
  ReceiptText,
  Settings,
  ShieldCheck,
  Sparkles,
  Utensils,
  WalletCards,
} from "lucide-react";
import type { Goal, Insight, Metric, NavItem, Position, Transaction } from "@/types/finance";

export const user = {
  firstName: "Diogo",
  lastName: "Silva",
  email: "diogo@norteai.pt",
  country: "Portugal",
  currency: "EUR",
  monthlyIncome: 4200,
  expenses: 2780,
  savings: 1420,
  netWorth: 245230,
  investments: 96350,
  cash: 18420,
  riskProfile: "Crescimento equilibrado",
};

export const desktopNav: NavItem[] = [
  { label: "Visao Geral", href: "/", icon: Home },
  { label: "Dinheiro", href: "/dinheiro", icon: WalletCards },
  { label: "Movimentos", href: "/movimentos", icon: ListTree },
  { label: "Investimentos", href: "/investimentos", icon: ChartNoAxesCombined },
  { label: "Patrimonio", href: "/patrimonio", icon: Landmark },
  { label: "Objetivos", href: "/goals", icon: GoalIcon },
  { label: "NorteAI", href: "/norteai", icon: Sparkles },
  { label: "Perfil", href: "/profile", icon: CircleDollarSign },
];

export const mobileNav: NavItem[] = [
  { label: "Inicio", href: "/", icon: Home },
  { label: "Dinheiro", href: "/dinheiro", icon: CreditCard },
  { label: "Movimentos", href: "/movimentos", icon: ListTree },
  { label: "Investir", href: "/investimentos", icon: ChartNoAxesCombined },
  { label: "Definicoes", href: "/definicoes", icon: Settings },
];

export const wealthCurve = [
  { month: "Jan", value: 171000 },
  { month: "Fev", value: 174600 },
  { month: "Mar", value: 173900 },
  { month: "Abr", value: 178300 },
  { month: "Mai", value: 181500 },
  { month: "Jun", value: 179700 },
  { month: "Jul", value: 205400 },
  { month: "Ago", value: 217800 },
  { month: "Set", value: 223600 },
  { month: "Out", value: 230200 },
  { month: "Nov", value: 237900 },
  { month: "Dez", value: 245230 },
];

export const metrics: Metric[] = [
  { label: "Conta corrente", value: "8.420€", caption: "Santander", tone: "blue", trend: [20, 25, 34, 31, 44, 51] },
  { label: "Poupanca", value: "12.000€", caption: "Meta mensal OK", tone: "green", trend: [18, 26, 29, 38, 34, 48] },
  { label: "Investimentos", value: "96.350€", caption: "+6,7% YTD", tone: "purple", trend: [28, 31, 42, 43, 51, 64] },
  { label: "Cripto", value: "8.500€", caption: "12% da carteira", tone: "amber", trend: [17, 22, 21, 35, 32, 47] },
];

export const insights: Insight[] = [
  {
    title: "Reserva de emergencia",
    description: "Tens 8.200€ acima da tua reserva definida.",
    tone: "green",
    icon: ShieldCheck,
  },
  {
    title: "Restaurantes",
    description: "Gastos 28% acima da media.",
    tone: "amber",
    icon: Utensils,
  },
  {
    title: "Subscricoes",
    description: "Podes poupar 320€/ano.",
    tone: "blue",
    icon: ReceiptText,
  },
];

export const transactions: Transaction[] = [
  { merchant: "Salario", account: "Conta corrente", amount: "+2.800,00€", date: "Hoje", tone: "positive" },
  { merchant: "Supermercado Continente", account: "Conta corrente", amount: "-85,40€", date: "Ontem", tone: "negative" },
  { merchant: "Vanguard FTSE All-World", account: "Investimentos", amount: "+120,00€", date: "2 Mai", tone: "positive" },
  { merchant: "Netflix", account: "Conta corrente", amount: "-15,99€", date: "1 Mai", tone: "negative" },
];

export const allocation = [
  { name: "ETFs", value: 62, color: "#6d28d9" },
  { name: "Acoes", value: 18, color: "#0f766e" },
  { name: "Cripto", value: 12, color: "#f59e0b" },
  { name: "Liquidez", value: 8, color: "#2563eb" },
];

export const positions: Position[] = [
  { name: "Vanguard FTSE All-World", type: "ETF global", value: 42850, performance: "+8,1%" },
  { name: "iShares Core S&P500", type: "ETF EUA", value: 24300, performance: "+7,4%" },
  { name: "Europe ETF", type: "ETF Europa", value: 11200, performance: "+3,8%" },
];

export const initialGoals: Goal[] = [
  {
    id: "house",
    name: "Comprar casa",
    type: "house",
    targetAmount: 60000,
    currentAmount: 45000,
    targetDate: "2028-06-30",
    priority: "Alta",
    status: "Ativo",
  },
  {
    id: "emergency",
    name: "Fundo emergencia",
    type: "emergency_fund",
    targetAmount: 12000,
    currentAmount: 12000,
    targetDate: "2026-12-31",
    priority: "Alta",
    status: "Concluido",
  },
];

export const accountRows = [
  { label: "Receitas", value: "4.200,00€", icon: Banknote, tone: "green" },
  { label: "Despesas", value: "2.780,00€", icon: ArrowDownUp, tone: "rose" },
  { label: "Poupanca", value: "1.420,00€", icon: PiggyBank, tone: "blue" },
  { label: "Ativos", value: "227.810€", icon: BriefcaseBusiness, tone: "purple" },
  { label: "Veiculo", value: "18.000€", icon: Car, tone: "amber" },
];

export const aiSuggestions = [
  "Posso comprar casa?",
  "Estou a investir bem?",
  "Onde posso poupar?",
  "Posso comprar um Tesla?",
];
