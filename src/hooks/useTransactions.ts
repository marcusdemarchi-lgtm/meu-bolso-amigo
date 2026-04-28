import { useCallback, useEffect, useState } from "react";
import type { Transaction } from "@/lib/finance";

const STORAGE_KEY = "finflow.transactions.v1";

function read(): Transaction[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Transaction[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setTransactions(read());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions, hydrated]);

  const add = useCallback((tx: Omit<Transaction, "id" | "createdAt">) => {
    const full: Transaction = {
      ...tx,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setTransactions((prev) => [full, ...prev]);
  }, []);

  const remove = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clear = useCallback(() => setTransactions([]), []);

  return { transactions, add, remove, clear, hydrated };
}
