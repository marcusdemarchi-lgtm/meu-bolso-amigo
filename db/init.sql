CREATE TABLE IF NOT EXISTS transactions (
  id          UUID PRIMARY KEY,
  type        TEXT NOT NULL CHECK (type IN ('income','expense')),
  amount      NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  category_id TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  date        DATE NOT NULL,
  created_at  BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
