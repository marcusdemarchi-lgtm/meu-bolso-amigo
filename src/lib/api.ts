import type { Transaction } from "./finance";

const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:3001";

export async function apiList(): Promise<Transaction[]> {
  const r = await fetch(`${API_URL}/transactions`);
  if (!r.ok) throw new Error("Falha ao carregar lançamentos");
  return r.json();
}

export async function apiCreate(tx: Transaction): Promise<void> {
  const r = await fetch(`${API_URL}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tx),
  });
  if (!r.ok) throw new Error("Falha ao salvar lançamento");
}

export async function apiDelete(id: string): Promise<void> {
  const r = await fetch(`${API_URL}/transactions/${id}`, { method: "DELETE" });
  if (!r.ok) throw new Error("Falha ao excluir lançamento");
}
