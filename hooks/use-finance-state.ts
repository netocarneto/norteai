"use client";

import { type Dispatch, type SetStateAction, useEffect, useMemo, useState } from "react";
import { calculateNorteScore, calculateSummary, initialFinanceState, normalizeFinanceState, scopeFinanceState } from "@/lib/finance-engine";
import type { FinanceState } from "@/types/finance";

const storageKey = "norteai-stage1-finance-state";
const stateEvent = "norteai-finance-state-change";

export function useFinanceState() {
  const [rootState, setState] = useState<FinanceState>(initialFinanceState);

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    if (raw) window.queueMicrotask(() => setState(normalizeFinanceState(JSON.parse(raw))));

    function handleStateChange(event: Event) {
      const detail = (event as CustomEvent<FinanceState>).detail;
      if (detail) setState(normalizeFinanceState(detail));
    }

    function handleStorage(event: StorageEvent) {
      if (event.key === storageKey && event.newValue) setState(normalizeFinanceState(JSON.parse(event.newValue)));
    }

    window.addEventListener(stateEvent, handleStateChange);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(stateEvent, handleStateChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const updateState: Dispatch<SetStateAction<FinanceState>> = (updater) => {
    setState((current) => {
      const next = normalizeFinanceState(typeof updater === "function" ? updater(current) : updater);
      window.localStorage.setItem(storageKey, JSON.stringify(next));
      window.queueMicrotask(() => window.dispatchEvent(new CustomEvent(stateEvent, { detail: next })));
      return next;
    });
  };

  const state = useMemo(() => scopeFinanceState(rootState), [rootState]);
  const summary = useMemo(() => calculateSummary(rootState), [rootState]);
  const score = useMemo(() => calculateNorteScore(summary), [summary]);
  const activeWorkspace = useMemo(() => rootState.workspaces.find((workspace) => workspace.id === rootState.activeWorkspaceId) ?? rootState.workspaces[0], [rootState.activeWorkspaceId, rootState.workspaces]);

  function setActiveWorkspace(workspaceId: string) {
    updateState((current) => ({ ...current, activeWorkspaceId: workspaceId }));
  }

  return { state, rootState, setState: updateState, summary, score, activeWorkspace, workspaces: rootState.workspaces, setActiveWorkspace };
}
