-- Add comments column to player_entries table
ALTER TABLE player_entries
ADD COLUMN IF NOT EXISTS comments TEXT;

-- Create an index on competition_id for faster queries when analyzing all entries in a competition
CREATE INDEX IF NOT EXISTS idx_player_entries_competition_id ON player_entries(competition_id);
