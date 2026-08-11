"use client";

import { useEffect, useMemo, useState } from "react";
import { calculateNorteScore, calculateSummary, initialFinanceState, normalizeFinanceState } from "@/lib/finance-engine";
import type { FinanceState } from "@/types/finance";

const storageKey = "norteai-stage1-finance-state";

export function useFinanceState() {
  const [state, setState] = useState<FinanceState>(() => {
    if (typeof window === "undefined") return initialFinanceState;
    const raw = window.localStorage.getItem(storageKey);
    return raw ? normalizeFinanceState(JSON.parse(raw)) : initialFinanceState;
  });

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  const summary = useMemo(() => calculateSummary(state), [state]);
  const score = useMemo(() => calculateNorteScore(summary), [summary]);

  return { state, setState, summary, score };
}
