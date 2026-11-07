-- Migration: 07_add_parent_chat_enabled.sql
-- Adds parent_chat_enabled column to system_settings if it doesn't already exist.

ALTER TABLE public.system_settings 
ADD COLUMN IF NOT EXISTS parent_chat_enabled BOOLEAN NOT NULL DEFAULT TRUE;
