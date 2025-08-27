/*
  # Fix payment and subscription tables migration

  1. New Tables
    - `subscriptions` (if not exists)
      - `id` (uuid, primary key)
      - `user_email` (text, user email)
      - `plan_id` (text, subscription plan identifier)
      - `plan_name` (text, plan name)
      - `amount` (numeric, subscription amount)
      - `currency` (text, currency code)
      - `status` (text, subscription status)
      - `stripe_subscription_id` (text, Stripe subscription ID)
      - `stripe_customer_id` (text, Stripe customer ID)
      - `created_at` (timestamp)
      - `expires_at` (timestamp)
    
    - `payments` (if not exists)
      - `id` (uuid, primary key)
      - `user_email` (text, user email)
      - `amount` (numeric, payment amount)
      - `currency` (text, currency code)
      - `status` (text, payment status)
      - `stripe_payment_intent_id` (text, Stripe payment intent ID)
      - `plan_id` (text, related plan)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for users to read their own data (only if they don't exist)
*/

-- Create subscriptions table if it doesn't exist
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  plan_id text NOT NULL,
  plan_name text NOT NULL,
  amount numeric NOT NULL,
  currency text DEFAULT 'TND',
  status text DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  stripe_subscription_id text,
  stripe_customer_id text,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL
);

-- Create payments table if it doesn't exist
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  amount numeric NOT NULL,
  currency text DEFAULT 'TND',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  stripe_payment_intent_id text NOT NULL,
  plan_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS (safe to run multiple times)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate them
DO $$
BEGIN
  -- Drop and recreate subscriptions policies
  DROP POLICY IF EXISTS "Users can read own subscriptions" ON subscriptions;
  DROP POLICY IF EXISTS "Users can insert own subscriptions" ON subscriptions;
  DROP POLICY IF EXISTS "Allow anonymous read subscriptions" ON subscriptions;
  DROP POLICY IF EXISTS "Allow anonymous insert subscriptions" ON subscriptions;
  
  -- Drop and recreate payments policies
  DROP POLICY IF EXISTS "Users can read own payments" ON payments;
  DROP POLICY IF EXISTS "Users can insert own payments" ON payments;
  DROP POLICY IF EXISTS "Allow anonymous read payments" ON payments;
  DROP POLICY IF EXISTS "Allow anonymous insert payments" ON payments;
END $$;

-- Create policies for subscriptions
CREATE POLICY "Users can read own subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can insert own subscriptions"
  ON subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'email' = user_email);

-- Create policies for payments
CREATE POLICY "Users can read own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can insert own payments"
  ON payments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'email' = user_email);

-- Allow anonymous access for demo purposes (remove in production)
CREATE POLICY "Allow anonymous read subscriptions"
  ON subscriptions
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous insert subscriptions"
  ON subscriptions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous read payments"
  ON payments
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous insert payments"
  ON payments
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create indexes for better performance (safe to run multiple times)
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_email ON subscriptions(user_email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_expires_at ON subscriptions(expires_at);
CREATE INDEX IF NOT EXISTS idx_payments_user_email ON payments(user_email);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);