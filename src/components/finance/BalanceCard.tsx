import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import { formatBRL, monthLabel } from "@/lib/finance";

type Props = {
  income: number;
  expense: number;
  monthKey: string;
};

export function BalanceCard({ income, expense, monthKey: mKey }: Props) {
  const balance = income - expense;
  const positive = balance >= 0;

  return (
    <section className="bg-gradient-hero shadow-card relative overflow-hidden rounded-3xl border border-border p-6 sm:p-8">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
      <div className="relative">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Wallet className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-[0.18em]">
            Saldo · <span className="capitalize">{monthLabel(mKey)}</span>
          </span>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <h1
            className={`font-display text-4xl font-semibold tracking-tight sm:text-5xl ${
              positive ? "text-foreground" : "text-expense"
            }`}
          >
            {formatBRL(balance)}
          </h1>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-surface/60 p-4 backdrop-blur">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-income/15 text-income">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
              Receitas
            </div>
            <div className="mt-2 font-display text-xl font-semibold text-income">
              {formatBRL(income)}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-surface/60 p-4 backdrop-blur">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-expense/15 text-expense">
                <ArrowDownRight className="h-3.5 w-3.5" />
              </span>
              Despesas
            </div>
            <div className="mt-2 font-display text-xl font-semibold text-expense">
              {formatBRL(expense)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
