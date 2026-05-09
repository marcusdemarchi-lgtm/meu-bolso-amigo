import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { Transaction } from "@/lib/finance";
import { apiCreate, apiDelete, apiList } from "@/lib/api";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    apiList()
      .then((data) => {
        if (!cancelled) setTransactions(data);
      })
      .catch((e) => {
        console.error(e);
        toast.error("Não foi possível conectar à API");
      })
      .finally(() => {
        if (!cancelled) setHydrated(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const add = useCallback((tx: Omit<Transaction, "id" | "createdAt">) => {
    const full: Transaction = {
      ...tx,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setTransactions((prev) => [full, ...prev]);
    apiCreate(full).catch((e) => {
      console.error(e);
      toast.error("Erro ao salvar — revertendo");
      setTransactions((prev) => prev.filter((t) => t.id !== full.id));
    });
  }, []);

  const remove = useCallback((id: string) => {
    const prevSnapshot = (curr: Transaction[]) => curr;
    setTransactions((prev) => {
      const snap = prevSnapshot(prev);
      apiDelete(id).catch((e) => {
        console.error(e);
        toast.error("Erro ao excluir — revertendo");
        setTransactions(snap);
      });
      return prev.filter((t) => t.id !== id);
    });
  }, []);

  const clear = useCallback(() => setTransactions([]), []);

  return { transactions, add, remove, clear, hydrated };
}
