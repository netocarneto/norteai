import { Plus } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <div className="grid size-12 place-items-center rounded-full bg-violet-50 text-violet-700">
        <Plus size={22} aria-hidden="true" />
      </div>
      <p className="mt-4 font-bold text-slate-950">{title}</p>
      <p className="mt-1 max-w-sm text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
