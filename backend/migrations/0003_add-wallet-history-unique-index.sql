-- Migration number: 0003 	 2026-03-12T13:18:17.605Z
-- prevent duplicate wallet searches per user

CREATE UNIQUE INDEX IF NOT EXISTS wallet_user_address_unique
ON wallet_history(user_id, wallet_address);