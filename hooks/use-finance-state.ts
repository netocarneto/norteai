"use client";

import { type Dispatch, type SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { calculateNorteScore, calculateSummary, initialFinanceState, normalizeFinanceState, scopeFinanceState } from "@/lib/finance-engine";
import { loadFinanceStateFromSupabase, persistWorkspaceToSupabase, provisionWorkspace } from "@/lib/supabase-finance-store";
import { supabase } from "@/lib/supabase-client";
import type { FinanceState } from "@/types/finance";

const storageKey = "norteai-stage1-finance-state";
const stateEvent = "norteai-finance-state-change";

export function useFinanceState() {
  const [rootState, setState] = useState<FinanceState>(initialFinanceState);
  const [isRemoteBacked, setIsRemoteBacked] = useState(false);
  const [isRemoteLoading, setIsRemoteLoading] = useState(false);
  const [remoteError, setRemoteError] = useState<string | null>(null);
  const isRemoteBackedRef = useRef(false);

  function cacheState(next: FinanceState) {
    window.localStorage.setItem(storageKey, JSON.stringify(next));
    window.queueMicrotask(() => window.dispatchEvent(new CustomEvent(stateEvent, { detail: next })));
  }

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    const cached = readCachedState(raw);
    if (cached) window.queueMicrotask(() => setState(cached));

    async function loadRemoteState() {
      if (!supabase) return;
      setIsRemoteLoading(true);
      setRemoteError(null);

      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          isRemoteBackedRef.current = false;
          setIsRemoteBacked(false);
          return;
        }

        const remote = await loadFinanceStateFromSupabase(supabase);
        const normalized = normalizeFinanceState(remote, { seedPrototypeWorkspaces: false });
        isRemoteBackedRef.current = true;
        setIsRemoteBacked(true);
        setState(normalized);
        cacheState(normalized);
      } catch (error) {
        isRemoteBackedRef.current = false;
        setIsRemoteBacked(false);
        setRemoteError(error instanceof Error ? error.message : "Não foi possível carregar dados Supabase.");
      } finally {
        setIsRemoteLoading(false);
      }
    }

    function handleStateChange(event: Event) {
      const detail = (event as CustomEvent<FinanceState>).detail;
      if (detail) setState(normalizeFinanceState(detail, { seedPrototypeWorkspaces: !isRemoteBackedRef.current }));
    }

    function handleStorage(event: StorageEvent) {
      if (isRemoteBackedRef.current) return;
      if (event.key === storageKey && event.newValue) {
        const next = readCachedState(event.newValue);
        if (next) setState(next);
      }
    }

    window.addEventListener(stateEvent, handleStateChange);
    window.addEventListener("storage", handleStorage);

    const authSubscription = supabase?.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") void loadRemoteState();
      if (event === "SIGNED_OUT") {
        isRemoteBackedRef.current = false;
        setIsRemoteBacked(false);
      }
    });
    void loadRemoteState();

    return () => {
      window.removeEventListener(stateEvent, handleStateChange);
      window.removeEventListener("storage", handleStorage);
      authSubscription?.data.subscription.unsubscribe();
    };
  }, []);

  const updateState: Dispatch<SetStateAction<FinanceState>> = (updater) => {
    setState((current) => {
      const workspaceId = current.activeWorkspaceId;
      const next = normalizeFinanceState(typeof updater === "function" ? updater(current) : updater, { seedPrototypeWorkspaces: !isRemoteBackedRef.current });
      cacheState(next);
      if (supabase && isRemoteBackedRef.current) {
        void persistWorkspaceToSupabase(supabase, next, workspaceId).catch((error: unknown) => {
          setRemoteError(error instanceof Error ? error.message : "Não foi possível guardar dados Supabase.");
        });
      }
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

  async function activateWorkspace(type: "FAMILY" | "FREELANCER") {
    if (supabase && isRemoteBackedRef.current) {
      setIsRemoteLoading(true);
      setRemoteError(null);
      try {
        const workspaceId = await provisionWorkspace(supabase, type, rootState.users[0]?.name);
        const remote = await loadFinanceStateFromSupabase(supabase);
        const normalized = normalizeFinanceState({ ...remote, activeWorkspaceId: workspaceId }, { seedPrototypeWorkspaces: false });
        setState(normalized);
        cacheState(normalized);
        return workspaceId;
      } catch (error) {
        setRemoteError(error instanceof Error ? error.message : "Não foi possível ativar o workspace.");
        throw error;
      } finally {
        setIsRemoteLoading(false);
      }
    }

    const seededWorkspace = initialFinanceState.workspaces.find((workspace) => workspace.type === type);
    if (!seededWorkspace) throw new Error("Workspace não encontrado no protótipo local.");
    updateState((current) => ({ ...current, activeWorkspaceId: seededWorkspace.id }));
    return seededWorkspace.id;
  }

  return {
    state,
    rootState,
    setState: updateState,
    summary,
    score,
    activeWorkspace,
    workspaces: rootState.workspaces,
    setActiveWorkspace,
    activateWorkspace,
    isRemoteBacked,
    isRemoteLoading,
    remoteError,
  };
}

function readCachedState(raw: string | null) {
  if (!raw) return null;
  try {
    return normalizeFinanceState(JSON.parse(raw));
  } catch {
    return null;
  }
}
