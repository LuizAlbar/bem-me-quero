-- Additive and safe to rerun on databases created before social settings were available.
ALTER TABLE store_settings
  ADD COLUMN IF NOT EXISTS whatsapp text,
  ADD COLUMN IF NOT EXISTS instagram text;
