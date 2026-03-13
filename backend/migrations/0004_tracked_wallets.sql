CREATE TABLE IF NOT EXISTS tracked_wallets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  created_at INTEGER NOT NULL,

  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE UNIQUE INDEX tracked_wallet_user_unique
ON tracked_wallets(user_id, wallet_address);