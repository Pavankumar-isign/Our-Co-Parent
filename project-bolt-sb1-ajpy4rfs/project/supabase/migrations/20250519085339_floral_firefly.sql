/*
  # Create Expenses Schema

  1. New Tables
    - `expenses`
      - `id` (uuid, primary key)
      - `title` (text)
      - `amount` (decimal)
      - `purchase_date` (timestamp)
      - `description` (text)
      - `receipt_url` (text)
      - `is_private` (boolean)
      - `status` (enum)
      - `created_by` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `expense_categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `split_ratio` (decimal)
      - `is_custom` (boolean)
      - `created_by` (uuid, foreign key)

    - `expense_children`
      - `expense_id` (uuid, foreign key)
      - `child_id` (uuid, foreign key)

    - `payments`
      - `id` (uuid, primary key)
      - `expense_id` (uuid, foreign key)
      - `amount` (decimal)
      - `method` (enum)
      - `paid_by` (uuid, foreign key)
      - `paid_at` (timestamp)
      - `notes` (text)
      - `confirmed` (boolean)

  2. Security
    - Enable RLS on all tables
    - Add policies for CRUD operations
*/

-- Create expense status enum
CREATE TYPE expense_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PAID');

-- Create payment method enum
CREATE TYPE payment_method AS ENUM ('CASH', 'CHECK', 'BANK_TRANSFER', 'OTHER');

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  amount decimal(10,2) NOT NULL,
  purchase_date timestamptz NOT NULL,
  description text,
  receipt_url text,
  is_private boolean NOT NULL DEFAULT false,
  status expense_status NOT NULL DEFAULT 'PENDING',
  created_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create expense categories table
CREATE TABLE IF NOT EXISTS expense_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  split_ratio decimal(3,2) NOT NULL DEFAULT 0.50,
  is_custom boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES users(id)
);

-- Create expense children junction table
CREATE TABLE IF NOT EXISTS expense_children (
  expense_id uuid REFERENCES expenses(id) ON DELETE CASCADE,
  child_id uuid REFERENCES users(id),
  PRIMARY KEY (expense_id, child_id)
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id uuid NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
  amount decimal(10,2) NOT NULL,
  method payment_method NOT NULL,
  paid_by uuid NOT NULL REFERENCES users(id),
  paid_at timestamptz NOT NULL,
  notes text,
  confirmed boolean NOT NULL DEFAULT false
);

-- Enable RLS
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_children ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policies for expenses
CREATE POLICY "Users can view their own expenses and shared expenses"
  ON expenses
  FOR SELECT
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM expense_children ec
      WHERE ec.expense_id = id AND ec.child_id = auth.uid()
    )
  );

CREATE POLICY "Users can create expenses"
  ON expenses
  FOR INSERT
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own pending expenses"
  ON expenses
  FOR UPDATE
  USING (created_by = auth.uid() AND status = 'PENDING');

CREATE POLICY "Users can delete their own pending expenses"
  ON expenses
  FOR DELETE
  USING (created_by = auth.uid() AND status = 'PENDING');

-- Create policies for expense categories
CREATE POLICY "Anyone can view expense categories"
  ON expense_categories
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create custom categories"
  ON expense_categories
  FOR INSERT
  WITH CHECK (created_by = auth.uid() AND is_custom = true);

-- Create policies for expense children
CREATE POLICY "Users can view expense children relationships"
  ON expense_children
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM expenses e
      WHERE e.id = expense_id AND (e.created_by = auth.uid() OR child_id = auth.uid())
    )
  );

-- Create policies for payments
CREATE POLICY "Users can view payments for their expenses"
  ON payments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM expenses e
      WHERE e.id = expense_id AND (e.created_by = auth.uid() OR paid_by = auth.uid())
    )
  );

CREATE POLICY "Users can create payments"
  ON payments
  FOR INSERT
  WITH CHECK (paid_by = auth.uid());

-- Insert default expense categories
INSERT INTO expense_categories (name, split_ratio, is_custom)
VALUES
  ('Medical/Dental', 0.50, false),
  ('Education', 0.50, false),
  ('Activities', 0.50, false),
  ('Clothing', 0.50, false),
  ('Transportation', 0.50, false),
  ('Other', 0.50, false);