/*
  # Create lieux (places) table for points of interest

  1. New Tables
    - `lieux`
      - `id` (uuid, primary key)
      - `nom` (text, place name)
      - `description` (text, place description)
      - `latitude` (numeric, latitude coordinate)
      - `longitude` (numeric, longitude coordinate)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `lieux` table
    - Add policies for public read access
    - Add policies for authenticated users to insert/update
*/

-- Create lieux table
CREATE TABLE IF NOT EXISTS lieux (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  description text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE lieux ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to lieux"
  ON lieux
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create policies for authenticated users to insert
CREATE POLICY "Allow authenticated users to insert lieux"
  ON lieux
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policies for authenticated users to update
CREATE POLICY "Allow authenticated users to update lieux"
  ON lieux
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lieux_nom ON lieux(nom);
CREATE INDEX IF NOT EXISTS idx_lieux_coordinates ON lieux(latitude, longitude);

-- Insert some sample data
INSERT INTO lieux (nom, description, latitude, longitude) VALUES
  ('Médina de Tunis', 'Centre historique de Tunis, site du patrimoine mondial de l''UNESCO', 36.7981, 10.1715),
  ('Sidi Bou Saïd', 'Village pittoresque aux maisons blanches et bleues', 36.8707, 10.3470),
  ('Carthage', 'Site archéologique antique avec ruines romaines', 36.8531, 10.3231),
  ('Mosquée Zitouna', 'Grande mosquée historique au cœur de la Médina', 36.7969, 10.1736),
  ('Musée du Bardo', 'Musée national avec la plus grande collection de mosaïques romaines', 36.8081, 10.1347),
  ('Lac de Tunis', 'Lagune naturelle entre Tunis et le golfe de Tunis', 36.8185, 10.2297),
  ('Parc du Belvédère', 'Grand parc urbain avec zoo et espaces verts', 36.8167, 10.1833),
  ('Port de La Goulette', 'Port principal de Tunis avec ferry vers l''Europe', 36.8186, 10.3056)
ON CONFLICT (id) DO NOTHING;