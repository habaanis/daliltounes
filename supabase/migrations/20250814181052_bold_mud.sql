/*
  # Create establishments table for Dalil Tounes

  1. New Tables
    - `establishments`
      - `id` (uuid, primary key)
      - `name` (text, establishment name)
      - `category` (text, establishment category)
      - `subcategory` (text, establishment subcategory)
      - `description` (text, establishment description)
      - `address` (text, full address)
      - `governorate` (text, governorate)
      - `district` (text, district for Tunis)
      - `phone` (text, phone number)
      - `email` (text, email address)
      - `website` (text, website URL)
      - `image` (text, image URL)
      - `rating` (numeric, rating 1-5)
      - `review_count` (integer, number of reviews)
      - `hours` (text, opening hours)
      - `services` (text[], array of services)
      - `latitude` (numeric, GPS latitude)
      - `longitude` (numeric, GPS longitude)
      - `verified` (boolean, verified status)
      - `premium` (boolean, premium status)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `establishments` table
    - Add policies for public read access
    - Add policies for authenticated users to insert/update
*/

-- Create establishments table
CREATE TABLE IF NOT EXISTS establishments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('hotel', 'cultural', 'administrative', 'sport', 'animal', 'construction', 'alimentation', 'sante', 'justice', 'ecole', 'taxi', 'tourism', 'divers')),
  subcategory text NOT NULL,
  description text NOT NULL,
  address text NOT NULL,
  governorate text NOT NULL CHECK (governorate IN ('tunis', 'ariana', 'ben-arous', 'manouba', 'nabeul', 'zaghouan', 'bizerte', 'beja', 'jendouba', 'kef', 'siliana', 'sousse', 'monastir', 'mahdia', 'sfax', 'kairouan', 'kasserine', 'sidi-bouzid', 'gabes', 'medenine', 'tataouine', 'gafsa', 'tozeur', 'kebili')),
  district text,
  phone text NOT NULL,
  email text,
  website text,
  image text DEFAULT 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
  rating numeric DEFAULT 4.0 CHECK (rating >= 1 AND rating <= 5),
  review_count integer DEFAULT 0,
  hours text DEFAULT '09:00 - 18:00',
  services text[] DEFAULT '{}',
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  verified boolean DEFAULT false,
  premium boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE establishments ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to establishments"
  ON establishments
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create policies for authenticated users to insert
CREATE POLICY "Allow authenticated users to insert establishments"
  ON establishments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policies for authenticated users to update
CREATE POLICY "Allow authenticated users to update establishments"
  ON establishments
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_establishments_name ON establishments(name);
CREATE INDEX IF NOT EXISTS idx_establishments_category ON establishments(category);
CREATE INDEX IF NOT EXISTS idx_establishments_governorate ON establishments(governorate);
CREATE INDEX IF NOT EXISTS idx_establishments_coordinates ON establishments(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_establishments_verified ON establishments(verified);
CREATE INDEX IF NOT EXISTS idx_establishments_premium ON establishments(premium);
CREATE INDEX IF NOT EXISTS idx_establishments_rating ON establishments(rating);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_establishments_updated_at 
    BEFORE UPDATE ON establishments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO establishments (name, category, subcategory, description, address, governorate, phone, latitude, longitude, verified, premium) VALUES
  ('Hôpital Charles Nicolle', 'sante', 'Hôpital public', 'Grand hôpital public de Tunis avec services d''urgence 24h/24', 'Rue Charles Nicolle, Tunis', 'tunis', '+216 71 663 000', 36.8065, 10.1815, true, false),
  ('Restaurant Dar El Jeld', 'alimentation', 'Restaurant traditionnel', 'Restaurant gastronomique tunisien dans un palais du 17ème siècle', '5 Rue Dar El Jeld, Médina, Tunis', 'tunis', '+216 71 560 916', 36.7981, 10.1715, true, true),
  ('Mairie de Tunis', 'administrative', 'Mairie', 'Hôtel de ville de Tunis - Services administratifs municipaux', 'Place de la Kasbah, Tunis', 'tunis', '+216 71 560 600', 36.7969, 10.1736, true, false),
  ('Clinique Pasteur', 'sante', 'Clinique privée', 'Clinique privée moderne avec équipements de pointe', 'Avenue Habib Bourguiba, Tunis', 'tunis', '+216 71 782 200', 36.8008, 10.1817, true, true),
  ('Café des Nattes', 'alimentation', 'Café traditionnel', 'Café traditionnel avec vue panoramique sur Sidi Bou Saïd', 'Sidi Bou Saïd', 'tunis', '+216 71 740 261', 36.8707, 10.3470, true, false)
ON CONFLICT (id) DO NOTHING;