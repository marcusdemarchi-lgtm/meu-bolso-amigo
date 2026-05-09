import express from "express";
import cors from "cors";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  host: process.env.PGHOST || "db",
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER || "finflow",
  password: process.env.PGPASSWORD || "finflow",
  database: process.env.PGDATABASE || "finflow",
});

// Wait for DB and ensure schema (idempotent)
async function init() {
  for (let i = 0; i < 30; i++) {
    try {
      await pool.query("SELECT 1");
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  await pool.query(`
    CREATE TABLE IF NOT EXISTS transactions (
      id UUID PRIMARY KEY,
      type TEXT NOT NULL CHECK (type IN ('income','expense')),
      amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
      category_id TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      date DATE NOT NULL,
      created_at BIGINT NOT NULL
    );
  `);
}

const app = express();
app.use(cors());
app.use(express.json());

const rowToTx = (r) => ({
  id: r.id,
  type: r.type,
  amount: Number(r.amount),
  categoryId: r.category_id,
  description: r.description,
  date: typeof r.date === "string" ? r.date : r.date.toISOString().slice(0, 10),
  createdAt: Number(r.created_at),
});

app.get("/health", (_req, res) => res.json({ ok: true }));

app.get("/transactions", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM transactions ORDER BY date DESC, created_at DESC",
    );
    res.json(rows.map(rowToTx));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "db_error" });
  }
});

app.post("/transactions", async (req, res) => {
  try {
    const { id, type, amount, categoryId, description, date, createdAt } = req.body || {};
    if (!id || !type || !amount || !categoryId || !date) {
      return res.status(400).json({ error: "invalid_payload" });
    }
    if (type !== "income" && type !== "expense") {
      return res.status(400).json({ error: "invalid_type" });
    }
    await pool.query(
      `INSERT INTO transactions (id, type, amount, category_id, description, date, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [id, type, amount, categoryId, description ?? "", date, createdAt ?? Date.now()],
    );
    res.status(201).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "db_error" });
  }
});

app.delete("/transactions/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM transactions WHERE id = $1", [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "db_error" });
  }
});

const port = Number(process.env.PORT || 3001);
init()
  .then(() => app.listen(port, "0.0.0.0", () => console.log(`API on :${port}`)))
  .catch((e) => {
    console.error("init failed", e);
    process.exit(1);
  });
