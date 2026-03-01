CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  profile_image TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER
);