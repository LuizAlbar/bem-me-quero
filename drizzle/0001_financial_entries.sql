-- Additive and repeatable. Apply with: pnpm exec tsx scripts/migrate-finance.ts
CREATE TABLE IF NOT EXISTS public.financial_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL,
  title text NOT NULL,
  amount_cents integer NOT NULL,
  occurred_on date NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  created_at timestamptz(3) NOT NULL DEFAULT now(),
  updated_at timestamptz(3) NOT NULL DEFAULT now(),
  CONSTRAINT financial_entries_kind_check CHECK (kind IN ('income', 'expense')),
  CONSTRAINT financial_entries_amount_check CHECK (amount_cents BETWEEN 1 AND 999999999),
  CONSTRAINT financial_entries_title_check CHECK (char_length(trim(title)) BETWEEN 1 AND 200)
);
CREATE INDEX IF NOT EXISTS financial_entries_date_idx ON public.financial_entries (occurred_on, id);
CREATE INDEX IF NOT EXISTS financial_entries_category_idx ON public.financial_entries (category_id, occurred_on);
CREATE INDEX IF NOT EXISTS financial_entries_product_idx ON public.financial_entries (product_id, occurred_on);
-- Financial data is private: only the privileged server connection may access it.
ALTER TABLE public.financial_entries ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.financial_entries FROM anon, authenticated;

-- Millisecond precision matches the optimistic version transported by JavaScript.
ALTER TABLE public.financial_entries
  ALTER COLUMN created_at TYPE timestamptz(3),
  ALTER COLUMN updated_at TYPE timestamptz(3);
