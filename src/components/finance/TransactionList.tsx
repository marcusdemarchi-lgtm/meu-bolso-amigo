import { Trash2 } from "lucide-react";
import {
  DEFAULT_CATEGORIES,
  formatBRL,
  formatDate,
  type Transaction,
} from "@/lib/finance";
import { Button } from "@/components/ui/button";

type Props = {
  transactions: Transaction[];
  onDelete: (id: string) => void;
};

export function TransactionList({ transactions, onDelete }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface/40 p-8 text-center">
        <p className="font-display text-lg">Sem lançamentos por aqui</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Toque em <span className="text-foreground">+</span> para adicionar o primeiro.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
      {transactions.map((t) => {
        const cat = DEFAULT_CATEGORIES.find((c) => c.id === t.categoryId);
        const sign = t.type === "income" ? "+" : "−";
        const color = t.type === "income" ? "text-income" : "text-expense";
        return (
          <li
            key={t.id}
            className="group flex items-center gap-3 px-4 py-3 transition hover:bg-surface-elevated/60"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${
                t.type === "income" ? "bg-income/15" : "bg-expense/15"
              }`}
            >
              {cat?.emoji ?? "💰"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{t.description}</p>
              <p className="text-xs text-muted-foreground">
                {cat?.name} · {formatDate(t.date)}
              </p>
            </div>
            <div className={`font-display text-base font-semibold tabular-nums ${color}`}>
              {sign} {formatBRL(t.amount)}
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(t.id)}
              className="h-8 w-8 text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:text-destructive"
              aria-label="Excluir"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
