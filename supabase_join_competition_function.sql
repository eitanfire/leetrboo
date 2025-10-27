-- Create the join_competition RPC function
-- This function allows users to join a competition using an invite code

-- Drop the existing function first if it exists
DROP FUNCTION IF EXISTS join_competition(TEXT, TEXT, TEXT);

CREATE OR REPLACE FUNCTION join_competition(
  code TEXT,
  player_name TEXT,
  video_url TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  competition_id_var INTEGER;
  user_id_var UUID;
BEGIN
  -- Get the current user ID (if authenticated)
  user_id_var := auth.uid();

  -- Look up the competition by the last 6 characters of competition_code (case-insensitive)
  -- This matches how the UI displays shortened codes using .slice(-6)
  SELECT id INTO competition_id_var
  FROM competitions
  WHERE LOWER(RIGHT(competition_code, 6)) = LOWER(code)
     OR LOWER(competition_code) = LOWER(code);

  -- If competition doesn't exist, raise an error
  IF competition_id_var IS NULL THEN
    RAISE EXCEPTION 'Competition code does not exist';
  END IF;

  -- Check if user has already joined this competition
  IF EXISTS (
    SELECT 1 FROM player_entries pe
    WHERE pe.competition_id = competition_id_var
    AND (
      (user_id_var IS NOT NULL AND pe.user_id = user_id_var)
      OR (pe.video_url = join_competition.video_url AND pe.player_name = join_competition.player_name)
    )
  ) THEN
    RAISE EXCEPTION 'You have already joined this competition';
  END IF;

  -- Insert the new player entry
  INSERT INTO player_entries (competition_id, player_name, video_url, user_id, created_at)
  VALUES (competition_id_var, player_name, video_url, user_id_var, NOW());

  -- Return success
  RETURN json_build_object('success', true, 'competition_id', competition_id_var);

EXCEPTION
  WHEN OTHERS THEN
    RAISE;
END;
$$;

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION join_competition(TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION join_competition(TEXT, TEXT, TEXT) TO anon;
