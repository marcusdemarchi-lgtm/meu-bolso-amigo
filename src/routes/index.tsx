import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { useTransactions } from "@/hooks/useTransactions";
import { currentMonthKey, monthKey } from "@/lib/finance";
import { BalanceCard } from "@/components/finance/BalanceCard";
import { TransactionForm } from "@/components/finance/TransactionForm";
import { TransactionList } from "@/components/finance/TransactionList";
import { CategoryBreakdown } from "@/components/finance/CategoryBreakdown";
import { MonthSwitcher } from "@/components/finance/MonthSwitcher";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FinFlow — Controle financeiro pessoal" },
      {
        name: "description",
        content:
          "Cadastre receitas, despesas e categorias. Acompanhe seu saldo mensal com um app financeiro simples e elegante.",
      },
      { property: "og:title", content: "FinFlow — Controle financeiro pessoal" },
      {
        property: "og:description",
        content: "Seu controle financeiro pessoal em um só lugar.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { transactions, add, remove, hydrated } = useTransactions();
  const [month, setMonth] = useState<string>(currentMonthKey());

  const ofMonth = useMemo(
    () => transactions.filter((t) => monthKey(t.date) === month),
    [transactions, month],
  );

  const income = ofMonth.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = ofMonth.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  const sorted = useMemo(
    () =>
      [...ofMonth].sort((a, b) =>
        a.date === b.date ? b.createdAt - a.createdAt : a.date < b.date ? 1 : -1,
      ),
    [ofMonth],
  );

  return (
    <main className="mx-auto min-h-dvh w-full max-w-2xl px-4 pb-32 pt-8 sm:px-6 sm:pt-12">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-income flex h-9 w-9 items-center justify-center rounded-xl text-primary-foreground shadow-glow">
            <span className="font-display text-lg font-bold">F</span>
          </div>
          <div>
            <p className="font-display text-base font-semibold leading-none">FinFlow</p>
            <p className="text-xs text-muted-foreground">Controle financeiro</p>
          </div>
        </div>
        <MonthSwitcher value={month} onChange={setMonth} />
      </header>

      <BalanceCard income={income} expense={expense} monthKey={month} />

      <div className="mt-6 hidden justify-end sm:flex">
        <TransactionForm onAdd={add} />
      </div>

      <div className="mt-6 space-y-6">
        <CategoryBreakdown transactions={ofMonth} />

        <section>
          <header className="mb-3 flex items-baseline justify-between px-1">
            <h2 className="font-display text-lg font-semibold">Lançamentos</h2>
            <span className="text-xs text-muted-foreground">
              {hydrated ? `${sorted.length} no mês` : ""}
            </span>
          </header>
          <TransactionList transactions={sorted} onDelete={remove} />
        </section>
      </div>

      {/* Mobile FAB */}
      <div className="sm:hidden">
        <TransactionForm onAdd={add} />
      </div>

      <Toaster position="top-center" theme="dark" />
    </main>
  );
}
