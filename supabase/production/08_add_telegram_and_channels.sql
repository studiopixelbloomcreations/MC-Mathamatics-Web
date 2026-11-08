-- Migration 08_add_telegram_and_channels.sql
-- Adds telegram and multi-channel configuration columns to system_settings

ALTER TABLE public.system_settings 
ADD COLUMN IF NOT EXISTS admin_telegram_id TEXT,
ADD COLUMN IF NOT EXISTS active_channel TEXT NOT NULL DEFAULT 'telegram',
ADD COLUMN IF NOT EXISTS telegram_enabled BOOLEAN NOT NULL DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS whatsapp_enabled BOOLEAN NOT NULL DEFAULT FALSE;
