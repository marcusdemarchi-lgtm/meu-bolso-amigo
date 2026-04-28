import { DEFAULT_CATEGORIES, formatBRL, type Transaction } from "@/lib/finance";

type Props = { transactions: Transaction[] };

export function CategoryBreakdown({ transactions }: Props) {
  const expenses = transactions.filter((t) => t.type === "expense");
  const total = expenses.reduce((s, t) => s + t.amount, 0);

  if (total === 0) return null;

  const byCat = new Map<string, number>();
  for (const t of expenses) {
    byCat.set(t.categoryId, (byCat.get(t.categoryId) ?? 0) + t.amount);
  }

  const rows = Array.from(byCat.entries())
    .map(([id, value]) => ({
      cat: DEFAULT_CATEGORIES.find((c) => c.id === id),
      value,
      pct: (value / total) * 100,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <header className="mb-4 flex items-baseline justify-between">
        <h2 className="font-display text-lg font-semibold">Despesas por categoria</h2>
        <span className="text-xs text-muted-foreground">{formatBRL(total)}</span>
      </header>
      <ul className="space-y-3">
        {rows.map((r) => (
          <li key={r.cat?.id}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span>{r.cat?.emoji}</span>
                <span className="font-medium">{r.cat?.name}</span>
              </span>
              <span className="tabular-nums text-muted-foreground">
                {formatBRL(r.value)} · {r.pct.toFixed(0)}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="bg-gradient-expense h-full rounded-full transition-all"
                style={{ width: `${r.pct}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
