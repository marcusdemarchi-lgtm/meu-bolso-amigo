export type TxType = "income" | "expense";

export type Category = {
  id: string;
  name: string;
  emoji: string;
  type: TxType;
};

export type Transaction = {
  id: string;
  type: TxType;
  amount: number; // positive number, sign is implied by type
  categoryId: string;
  description: string;
  date: string; // ISO yyyy-mm-dd
  createdAt: number;
};

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "salary", name: "Salário", emoji: "💼", type: "income" },
  { id: "freela", name: "Freelance", emoji: "💻", type: "income" },
  { id: "invest", name: "Investimentos", emoji: "📈", type: "income" },
  { id: "gift", name: "Presente", emoji: "🎁", type: "income" },
  { id: "other-in", name: "Outras receitas", emoji: "✨", type: "income" },

  { id: "food", name: "Alimentação", emoji: "🍔", type: "expense" },
  { id: "transport", name: "Transporte", emoji: "🚗", type: "expense" },
  { id: "home", name: "Moradia", emoji: "🏠", type: "expense" },
  { id: "health", name: "Saúde", emoji: "💊", type: "expense" },
  { id: "fun", name: "Lazer", emoji: "🎬", type: "expense" },
  { id: "shopping", name: "Compras", emoji: "🛍️", type: "expense" },
  { id: "edu", name: "Educação", emoji: "📚", type: "expense" },
  { id: "bills", name: "Contas", emoji: "🧾", type: "expense" },
  { id: "other-out", name: "Outras despesas", emoji: "💳", type: "expense" },
];

export const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
};

export const todayISO = () => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

export const monthKey = (iso: string) => iso.slice(0, 7); // yyyy-mm

export const currentMonthKey = () => todayISO().slice(0, 7);

export const monthLabel = (key: string) => {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
};
