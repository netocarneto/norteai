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

const freelancerAssetOptions: Array<{ type: AssetType; label: string }> = [
  { type: "valuables", label: "Equipamento" },
  { type: "vehicle", label: "Veículo" },
  { type: "real_estate", label: "Imóvel profissional" },
  { type: "business", label: "Stock" },
  { type: "other", label: "Outro" },
];

const freelancerLiabilityOptions: Array<{ type: LiabilityType; label: string }> = [
  { type: "personal_loan", label: "Crédito equipamento" },
  { type: "auto_loan", label: "Crédito automóvel" },
  { type: "credit_card", label: "Fornecedor" },
  { type: "other", label: "Outro" },
];

export function WealthStageOnePage() {
  const { state, setState, summary, activeWorkspace } = useFinanceState();
  const [assetDraft, setAssetDraft] = useState<Omit<AssetRecord, "id" | "workspaceId">>(emptyAsset);
  const [liabilityDraft, setLiabilityDraft] = useState<Omit<LiabilityRecord, "id" | "workspaceId">>(emptyLiability);
  const [editingAsset, setEditingAsset] = useState<string | null>(null);
  const [editingLiability, setEditingLiability] = useState<string | null>(null);
  const isFreelancer = activeWorkspace?.type === "FREELANCER";
  const assetOptions = isFreelancer ? freelancerAssetOptions : assetTypes.map((type) => ({ type, label: assetTypeLabels[type] }));
  const liabilityOptions = isFreelancer ? freelancerLiabilityOptions : liabilityTypes.map((type) => ({ type, label: liabilityTypeLabels[type] }));
  const liabilityDraftType = isFreelancer && !liabilityOptions.some((option) => option.type === liabilityDraft.type) ? "personal_loan" : liabilityDraft.type;
  const professionalAssets = state.assets.reduce((total, asset) => total + asset.value * ((asset.ownershipPercentage ?? 100) / 100), 0);
  const professionalLiabilities = state.liabilities.reduce((total, item) => total + item.balance, 0);
  const professionalNetWorth = professionalAssets - professionalLiabilities;
  const monthlyPayments = state.liabilities.reduce((total, item) => total + item.monthlyPayment, 0);

  function saveAsset() {
    if (!assetDraft.name || !activeWorkspace) return;
    const asset = { ...assetDraft, workspaceId: activeWorkspace.id };
    setState((current) => ({
      ...current,
      assets: editingAsset ? current.assets.map((item) => (item.id === editingAsset ? { ...asset, id: editingAsset } : item)) : [...current.assets, { ...asset, id: `asset-${Date.now()}` }],
    }));
    setAssetDraft(isFreelancer ? { ...emptyAsset, type: "valuables" } : emptyAsset);
    setEditingAsset(null);
  }

  function saveLiability() {
    if (!liabilityDraft.name || !activeWorkspace) return;
    const liability = { ...liabilityDraft, type: liabilityDraftType, workspaceId: activeWorkspace.id };
    setState((current) => ({
      ...current,
      liabilities: editingLiability ? current.liabilities.map((item) => (item.id === editingLiability ? { ...liability, id: editingLiability } : item)) : [...current.liabilities, { ...liability, id: `lia-${Date.now()}` }],
    }));
    setLiabilityDraft(isFreelancer ? { ...emptyLiability, type: "personal_loan" } : emptyLiability);
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
          <h1 className="page-title">{isFreelancer ? "Património profissional" : "Património"}</h1>
          <p className="page-subtitle">{isFreelancer ? "Ativos profissionais, obrigações e valor líquido da atividade." : "Ativos, passivos e património líquido calculado."}</p>
        </section>

        {isFreelancer ? (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard label="Ativos profissionais" value={euro.format(professionalAssets)} />
            <SummaryCard label="Obrigações" value={euro.format(professionalLiabilities)} />
            <SummaryCard label="Património profissional" value={euro.format(professionalNetWorth)} />
            <SummaryCard label="Pagamentos mensais" value={euro.format(monthlyPayments)} />
          </section>
        ) : (
          <section className="grid gap-4 md:grid-cols-3">
            <SummaryCard label="Ativos" value={euro.format(summary.assets)} />
            <SummaryCard label="Dívida total" value={euro.format(summary.liabilities)} />
            <SummaryCard label="Pagamentos mensais" value={euro.format(monthlyPayments)} />
          </section>
        )}

        <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
          <CrudPanel title={editingAsset ? (isFreelancer ? "Editar ativo profissional" : "Editar ativo") : (isFreelancer ? "Criar ativo profissional" : "Criar ativo")}>
            <label className="form-field"><span>Nome</span><input value={assetDraft.name} onChange={(event) => setAssetDraft({ ...assetDraft, name: event.target.value })} placeholder={isFreelancer ? "Computador profissional" : "Casa"} /></label>
            <label className="form-field"><span>Tipo</span><select value={assetDraft.type} onChange={(event) => setAssetDraft({ ...assetDraft, type: event.target.value as AssetType })}>{assetOptions.map((option) => <option key={option.type} value={option.type}>{option.label}</option>)}</select></label>
            <label className="form-field"><span>Valor</span><input type="number" value={assetDraft.value} onChange={(event) => setAssetDraft({ ...assetDraft, value: Number(event.target.value) })} /></label>
            <label className="form-field"><span>Descrição</span><input value={assetDraft.description ?? ""} onChange={(event) => setAssetDraft({ ...assetDraft, description: event.target.value })} /></label>
            <button className="primary-button md:col-span-2" onClick={saveAsset}>{editingAsset ? "Guardar ativo" : (isFreelancer ? "Criar ativo profissional" : "Criar ativo")}</button>
          </CrudPanel>

          <CrudPanel title={editingLiability ? (isFreelancer ? "Editar obrigação" : "Editar dívida") : (isFreelancer ? "Criar obrigação" : "Criar dívida")}>
            <label className="form-field"><span>Nome</span><input value={liabilityDraft.name} onChange={(event) => setLiabilityDraft({ ...liabilityDraft, name: event.target.value })} placeholder={isFreelancer ? "Crédito equipamento" : "Crédito habitação"} /></label>
            <label className="form-field"><span>Tipo</span><select value={liabilityDraftType} onChange={(event) => setLiabilityDraft({ ...liabilityDraft, type: event.target.value as LiabilityType })}>{liabilityOptions.map((option) => <option key={option.type} value={option.type}>{option.label}</option>)}</select></label>
            <label className="form-field"><span>{isFreelancer ? "Valor a pagar" : "Saldo em dívida"}</span><input type="number" value={liabilityDraft.balance} onChange={(event) => setLiabilityDraft({ ...liabilityDraft, balance: Number(event.target.value) })} /></label>
            <label className="form-field"><span>Pagamento mensal</span><input type="number" value={liabilityDraft.monthlyPayment} onChange={(event) => setLiabilityDraft({ ...liabilityDraft, monthlyPayment: Number(event.target.value) })} /></label>
            <label className="form-field"><span>Juro %</span><input type="number" value={liabilityDraft.interestRate} onChange={(event) => setLiabilityDraft({ ...liabilityDraft, interestRate: Number(event.target.value) })} /></label>
            <button className="primary-button" onClick={saveLiability}>{editingLiability ? (isFreelancer ? "Guardar obrigação" : "Guardar dívida") : (isFreelancer ? "Criar obrigação" : "Criar dívida")}</button>
          </CrudPanel>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
          <ListPanel title={isFreelancer ? "Ativos profissionais" : "Ativos"}>
            {state.assets.map((asset) => (
              <Row key={asset.id} title={asset.name} subtitle={assetDisplayLabel(asset.type, isFreelancer)} value={euro.format(asset.value)} onEdit={() => {
                setAssetDraft({ name: asset.name, type: asset.type, value: asset.value, currency: asset.currency, ownershipType: asset.ownershipType, ownershipPercentage: asset.ownershipPercentage, valuationDate: asset.valuationDate, description: asset.description ?? "", notes: asset.notes ?? "" });
                setEditingAsset(asset.id);
              }} onDelete={() => deleteAsset(asset)} />
            ))}
          </ListPanel>
          <ListPanel title={isFreelancer ? "Obrigações profissionais" : "Passivos"}>
            {state.liabilities.map((liability) => (
              <Row key={liability.id} title={liability.name} subtitle={`${liabilityDisplayLabel(liability.type, isFreelancer)} · ${liability.interestRate}%`} value={euro.format(liability.balance)} onEdit={() => {
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

function assetDisplayLabel(type: AssetType, isFreelancer: boolean) {
  if (!isFreelancer) return assetTypeLabels[type];
  return freelancerAssetOptions.find((option) => option.type === type)?.label ?? assetTypeLabels[type];
}

function liabilityDisplayLabel(type: LiabilityType, isFreelancer: boolean) {
  if (!isFreelancer) return liabilityTypeLabels[type];
  return freelancerLiabilityOptions.find((option) => option.type === type)?.label ?? liabilityTypeLabels[type];
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
    <div className="flex flex-wrap items-center gap-3 py-4">
      <div className="min-w-0 flex-1"><p className="truncate font-black text-slate-950">{title}</p><p className="text-sm text-slate-500">{subtitle}</p></div>
      <p className="shrink-0 font-black text-slate-950">{value}</p>
      <div className="flex shrink-0 gap-2">
        <button className="icon-button" onClick={onEdit} aria-label="Editar"><Edit3 size={15} /></button>
        <button className="icon-button" onClick={onDelete} aria-label="Eliminar"><Trash2 size={15} /></button>
      </div>
    </div>
  );
}
