import { ChartNoAxesCombined, CreditCard, Home, Landmark, ListTree, Settings, WalletCards } from "lucide-react";
import type { NavItem } from "@/types/finance";

export const desktopNav: NavItem[] = [
  { label: "Visão Geral", href: "/", icon: Home },
  { label: "Dinheiro", href: "/dinheiro", icon: WalletCards },
  { label: "Movimentos", href: "/movimentos", icon: ListTree },
  { label: "Investir", href: "/investimentos", icon: ChartNoAxesCombined },
  { label: "Património", href: "/patrimonio", icon: Landmark },
  { label: "Definições", href: "/definicoes", icon: Settings },
];

export const mobileNav: NavItem[] = [
  { label: "Início", href: "/", icon: Home },
  { label: "Dinheiro", href: "/dinheiro", icon: CreditCard },
  { label: "Movimentos", href: "/movimentos", icon: ListTree },
  { label: "Investir", href: "/investimentos", icon: ChartNoAxesCombined },
  { label: "Património", href: "/patrimonio", icon: Landmark },
  { label: "Definições", href: "/definicoes", icon: Settings },
];
