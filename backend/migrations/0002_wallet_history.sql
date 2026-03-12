CREATE TABLE IF NOT EXISTS wallet_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  created_at INTEGER NOT NULL,

  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE UNIQUE INDEX wallet_user_address_unique
ON wallet_history(user_id, wallet_address);