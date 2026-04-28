import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_CATEGORIES, todayISO, type TxType } from "@/lib/finance";
import { toast } from "sonner";

type Props = {
  onAdd: (tx: {
    type: TxType;
    amount: number;
    categoryId: string;
    description: string;
    date: string;
  }) => void;
};

export function TransactionForm({ onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<TxType>("expense");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("food");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(todayISO());

  const cats = DEFAULT_CATEGORIES.filter((c) => c.type === type);

  const reset = () => {
    setAmount("");
    setDescription("");
    setDate(todayISO());
    setCategoryId(type === "expense" ? "food" : "salary");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(amount.replace(",", "."));
    if (!value || value <= 0) {
      toast.error("Informe um valor válido");
      return;
    }
    onAdd({
      type,
      amount: value,
      categoryId,
      description: description.trim() || cats.find((c) => c.id === categoryId)?.name || "",
      date,
    });
    toast.success("Lançamento adicionado");
    reset();
    setOpen(false);
  };

  const switchType = (t: TxType) => {
    setType(t);
    setCategoryId(t === "expense" ? "food" : "salary");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="shadow-glow fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full p-0 sm:static sm:h-11 sm:w-auto sm:px-5"
        >
          <Plus className="h-5 w-5 sm:mr-1" />
          <span className="hidden sm:inline">Novo lançamento</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Novo lançamento</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted/50 p-1">
            <button
              type="button"
              onClick={() => switchType("expense")}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                type === "expense"
                  ? "bg-expense text-expense-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Despesa
            </button>
            <button
              type="button"
              onClick={() => switchType("income")}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                type === "income"
                  ? "bg-income text-income-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Receita
            </button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              inputMode="decimal"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="font-display text-2xl"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cats.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    <span className="mr-2">{c.emoji}</span>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc">Descrição (opcional)</Label>
            <Input
              id="desc"
              placeholder="Ex.: Almoço com cliente"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            Adicionar lançamento
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
