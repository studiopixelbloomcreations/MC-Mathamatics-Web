-- Migration 09_add_chat_sessions.sql
-- Table to store persistent conversation sessions and chat history across turns

CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id TEXT PRIMARY KEY,                       -- e.g. "telegram:12345678" or "wa:+9477..."
  channel TEXT NOT NULL DEFAULT 'telegram',
  sender_id TEXT NOT NULL,
  student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
  student_unique_id TEXT,                    -- e.g. "MCG10TP1002"
  messages JSONB NOT NULL DEFAULT '[]'::JSONB, -- Array of { role: 'user'|'assistant', content: string, timestamp: string }
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_sender ON public.chat_sessions(sender_id);
