"use client";

import { useState } from "react";
import { Edit3, Landmark, Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { confirmDeletion, explainDeletionBlock } from "@/lib/destructive-actions";
import { assetTypeLabels, assetTypes, euro, liabilityTypeLabels, liabilityTypes } from "@/lib/finance-engine";
import { useFinanceState } from "@/hooks/use-finance-state";
import type { AssetRecord, AssetType, LiabilityRecord, LiabilityType } from "@/types/finance";

const emptyAsset = { name: "", type: "real_estate" as AssetType, value: 0, currency: "EUR", ownershipType: "personal" as const, ownershipPercentage: 100, valuationDate: "2026-08-11", description: "", notes: "" };
const emptyLiability = { name: "", type: "mortgage" as LiabilityType, balance: 0, monthlyPayment: 0, interestRate: 0, currency: "EUR", maturityDate: "" };

export function WealthStageOnePage() {
  const { state, setState, summary, activeWorkspace } = useFinanceState();
  const [assetDraft, setAssetDraft] = useState<Omit<AssetRecord, "id" | "workspaceId">>(emptyAsset);
  const [liabilityDraft, setLiabilityDraft] = useState<Omit<LiabilityRecord, "id" | "workspaceId">>(emptyLiability);
  const [editingAsset, setEditingAsset] = useState<string | null>(null);
  const [editingLiability, setEditingLiability] = useState<string | null>(null);

  function saveAsset() {
    if (!assetDraft.name || !activeWorkspace) return;
    const asset = { ...assetDraft, workspaceId: activeWorkspace.id };
    setState((current) => ({
      ...current,
      assets: editingAsset ? current.assets.map((item) => (item.id === editingAsset ? { ...asset, id: editingAsset } : item)) : [...current.assets, { ...asset, id: `asset-${Date.now()}` }],
    }));
    setAssetDraft(emptyAsset);
    setEditingAsset(null);
  }

  function saveLiability() {
    if (!liabilityDraft.name || !activeWorkspace) return;
    const liability = { ...liabilityDraft, workspaceId: activeWorkspace.id };
    setState((current) => ({
      ...current,
      liabilities: editingLiability ? current.liabilities.map((item) => (item.id === editingLiability ? { ...liability, id: editingLiability } : item)) : [...current.liabilities, { ...liability, id: `lia-${Date.now()}` }],
    }));
    setLiabilityDraft(emptyLiability);
    setEditingLiability(null);
  }

  function deleteAsset(asset: AssetRecord) {
    const hasInvestments = state.investments.some((investment) => investment.assetId === asset.id);
    if (hasInvestments) {
      explainDeletionBlock("Este ativo tem posições associadas. Remove ou altera essas posições antes de eliminar o ativo.");
      return;
    }

    if (!confirmDeletion(asset.name)) return;
    setState((current) => ({ ...current, assets: current.assets.filter((item) => item.id !== asset.id) }));
  }

  function deleteLiability(liability: LiabilityRecord) {
    if (!confirmDeletion(liability.name)) return;
    setState((current) => ({ ...current, liabilities: current.liabilities.filter((item) => item.id !== liability.id) }));
  }

  return (
    <AppShell activePath="/patrimonio">
      <div className="space-y-6">
        <section>
          <h1 className="page-title">Património</h1>
          <p className="page-subtitle">Ativos, passivos e património líquido calculado.</p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <SummaryCard label="Ativos" value={euro.format(summary.assets)} />
          <SummaryCard label="Dívida total" value={euro.format(summary.liabilities)} />
          <SummaryCard label="Pagamentos mensais" value={euro.format(state.liabilities.reduce((total, item) => total + item.monthlyPayment, 0))} />
        </section>

        <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
          <CrudPanel title={editingAsset ? "Editar ativo" : "Criar ativo"}>
            <label className="form-field"><span>Nome</span><input value={assetDraft.name} onChange={(event) => setAssetDraft({ ...assetDraft, name: event.target.value })} placeholder="Casa" /></label>
            <label className="form-field"><span>Tipo</span><select value={assetDraft.type} onChange={(event) => setAssetDraft({ ...assetDraft, type: event.target.value as AssetType })}>{assetTypes.map((type) => <option key={type} value={type}>{assetTypeLabels[type]}</option>)}</select></label>
            <label className="form-field"><span>Valor</span><input type="number" value={assetDraft.value} onChange={(event) => setAssetDraft({ ...assetDraft, value: Number(event.target.value) })} /></label>
            <label className="form-field"><span>Descrição</span><input value={assetDraft.description ?? ""} onChange={(event) => setAssetDraft({ ...assetDraft, description: event.target.value })} /></label>
            <button className="primary-button md:col-span-2" onClick={saveAsset}>{editingAsset ? "Guardar ativo" : "Criar ativo"}</button>
          </CrudPanel>

          <CrudPanel title={editingLiability ? "Editar dívida" : "Criar dívida"}>
            <label className="form-field"><span>Nome</span><input value={liabilityDraft.name} onChange={(event) => setLiabilityDraft({ ...liabilityDraft, name: event.target.value })} placeholder="Crédito habitação" /></label>
            <label className="form-field"><span>Tipo</span><select value={liabilityDraft.type} onChange={(event) => setLiabilityDraft({ ...liabilityDraft, type: event.target.value as LiabilityType })}>{liabilityTypes.map((type) => <option key={type} value={type}>{liabilityTypeLabels[type]}</option>)}</select></label>
            <label className="form-field"><span>Saldo em dívida</span><input type="number" value={liabilityDraft.balance} onChange={(event) => setLiabilityDraft({ ...liabilityDraft, balance: Number(event.target.value) })} /></label>
            <label className="form-field"><span>Pagamento mensal</span><input type="number" value={liabilityDraft.monthlyPayment} onChange={(event) => setLiabilityDraft({ ...liabilityDraft, monthlyPayment: Number(event.target.value) })} /></label>
            <label className="form-field"><span>Juro %</span><input type="number" value={liabilityDraft.interestRate} onChange={(event) => setLiabilityDraft({ ...liabilityDraft, interestRate: Number(event.target.value) })} /></label>
            <button className="primary-button" onClick={saveLiability}>{editingLiability ? "Guardar dívida" : "Criar dívida"}</button>
          </CrudPanel>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
          <ListPanel title="Ativos">
            {state.assets.map((asset) => (
              <Row key={asset.id} title={asset.name} subtitle={assetTypeLabels[asset.type]} value={euro.format(asset.value)} onEdit={() => {
                setAssetDraft({ name: asset.name, type: asset.type, value: asset.value, currency: asset.currency, ownershipType: asset.ownershipType, ownershipPercentage: asset.ownershipPercentage, valuationDate: asset.valuationDate, description: asset.description ?? "", notes: asset.notes ?? "" });
                setEditingAsset(asset.id);
              }} onDelete={() => deleteAsset(asset)} />
            ))}
          </ListPanel>
          <ListPanel title="Passivos">
            {state.liabilities.map((liability) => (
              <Row key={liability.id} title={liability.name} subtitle={`${liabilityTypeLabels[liability.type]} · ${liability.interestRate}%`} value={euro.format(liability.balance)} onEdit={() => {
                setLiabilityDraft({ name: liability.name, type: liability.type, balance: liability.balance, monthlyPayment: liability.monthlyPayment, interestRate: liability.interestRate, currency: liability.currency, maturityDate: liability.maturityDate ?? "" });
                setEditingLiability(liability.id);
              }} onDelete={() => deleteLiability(liability)} />
            ))}
          </ListPanel>
        </section>
      </div>
    </AppShell>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
      <Landmark size={22} className="text-violet-700" aria-hidden="true" />
      <p className="mt-4 text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
    </article>
  );
}

function CrudPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
      <div className="flex items-center gap-2"><Plus size={20} className="text-violet-700" /><h2 className="section-title">{title}</h2></div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">{children}</div>
    </article>
  );
}

function ListPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return <article className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100"><h2 className="section-title">{title}</h2><div className="mt-4 divide-y divide-slate-100">{children}</div></article>;
}

function Row({ title, subtitle, value, onEdit, onDelete }: { title: string; subtitle: string; value: string; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-3 py-4">
      <div className="min-w-0 flex-1"><p className="truncate font-black text-slate-950">{title}</p><p className="text-sm text-slate-500">{subtitle}</p></div>
      <p className="font-black text-slate-950">{value}</p>
      <button className="icon-button" onClick={onEdit} aria-label="Editar"><Edit3 size={15} /></button>
      <button className="icon-button" onClick={onDelete} aria-label="Eliminar"><Trash2 size={15} /></button>
    </div>
  );
}
