import { TriangleAlert } from "lucide-react";

export function ErrorState({ message = "Nao foi possivel carregar esta area." }: { message?: string }) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-900">
      <div className="flex items-center gap-3 font-bold">
        <TriangleAlert size={19} aria-hidden="true" />
        <span>Algo correu mal</span>
      </div>
      <p className="mt-2 text-sm">{message}</p>
    </div>
  );
}
