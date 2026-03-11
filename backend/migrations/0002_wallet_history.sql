CREATE TABLE IF NOT EXISTS wallet_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  created_at INTEGER NOT NULL,

  FOREIGN KEY(user_id) REFERENCES users(id)
);