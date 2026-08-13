import { ChartNoAxesCombined, CreditCard, Home, ListTree, Settings, WalletCards } from "lucide-react";
import type { NavItem } from "@/types/finance";

export const desktopNav: NavItem[] = [
  { label: "Visão Geral", href: "/", icon: Home },
  { label: "Dinheiro", href: "/dinheiro", icon: WalletCards },
  { label: "Movimentos", href: "/movimentos", icon: ListTree },
  { label: "Investir", href: "/investimentos", icon: ChartNoAxesCombined },
  { label: "Definições", href: "/definicoes", icon: Settings },
];

export const mobileNav: NavItem[] = [
  { label: "Início", href: "/", icon: Home },
  { label: "Dinheiro", href: "/dinheiro", icon: CreditCard },
  { label: "Movimentos", href: "/movimentos", icon: ListTree },
  { label: "Investir", href: "/investimentos", icon: ChartNoAxesCombined },
  { label: "Definições", href: "/definicoes", icon: Settings },
];
