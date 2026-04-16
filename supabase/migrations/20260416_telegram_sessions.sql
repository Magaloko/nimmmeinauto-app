-- Telegram bot conversation state
-- Run this once in Supabase SQL Editor → https://supabase.com/dashboard/project/mqwojxslzzedadkbnads/sql

CREATE TABLE IF NOT EXISTS telegram_sessions (
  chat_id    bigint      PRIMARY KEY,
  step       text        NOT NULL DEFAULT 'make',
  data       jsonb       NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE telegram_sessions ENABLE ROW LEVEL SECURITY;
-- Service role bypasses RLS — no policies needed; bot uses service key only.
