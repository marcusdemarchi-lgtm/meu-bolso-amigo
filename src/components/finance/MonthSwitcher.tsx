import { ChevronLeft, ChevronRight } from "lucide-react";
import { monthLabel } from "@/lib/finance";

type Props = {
  value: string; // yyyy-mm
  onChange: (next: string) => void;
};

function shift(key: string, delta: number) {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function MonthSwitcher({ value, onChange }: Props) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-full border border-border bg-surface/60 p-1 backdrop-blur">
      <button
        onClick={() => onChange(shift(value, -1))}
        className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
        aria-label="Mês anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="px-2 text-sm font-medium capitalize">{monthLabel(value)}</span>
      <button
        onClick={() => onChange(shift(value, 1))}
        className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
        aria-label="Próximo mês"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
