/*
  # Family Tree Schema

  1. New Tables
    - `people`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `birth_date` (date)
      - `death_date` (date, nullable)
      - `photo_url` (text, nullable)
      - `user_id` (uuid, foreign key)
    
    - `relations`
      - `id` (uuid, primary key)
      - `person1_id` (uuid, foreign key)
      - `person2_id` (uuid, foreign key)
      - `relation_type` (text)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

CREATE TABLE people (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  birth_date date NOT NULL,
  death_date date,
  photo_url text,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE relations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  person1_id uuid REFERENCES people(id) ON DELETE CASCADE,
  person2_id uuid REFERENCES people(id) ON DELETE CASCADE,
  relation_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE relations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own people"
  ON people
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage relations for their people"
  ON relations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM people
      WHERE (id = relations.person1_id OR id = relations.person2_id)
      AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM people
      WHERE (id = relations.person1_id OR id = relations.person2_id)
      AND user_id = auth.uid()
    )
  );