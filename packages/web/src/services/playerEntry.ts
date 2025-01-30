import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export interface PlayerEntry {
  id?: number;
  player_name: string;
  video_url: string;
  competition_id?: number;
  created_at?: string;
}

export function usePlayerEntries(competitionId?: number) {
  const [playerEntries, setPlayerEntries] = useState<PlayerEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayerEntries = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("No authenticated user found");
        return;
      }

      let query = supabase
        .from("player_entries")
        .select("*")
        .order("created_at", { ascending: false });

      // Only fetch entries for the selected competition
      if (competitionId) {
        query = query.eq("competition_id", competitionId);
      } else {
        // If no competition is selected, don't fetch any entries
        setPlayerEntries([]);
        setIsLoading(false);
        return;
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) {
        throw supabaseError;
      }

      setPlayerEntries(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching player entries:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const insertPlayerEntry = async (
    entry: PlayerEntry
  ): Promise<PlayerEntry | null> => {
    try {
      setError(null);

      if (!entry.competition_id) {
        throw new Error("Competition ID is required");
      }

      const { data, error: insertError } = await supabase
        .from("player_entries")
        .insert([entry])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Update the local state with the new entry
      setPlayerEntries((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error inserting player entry";
      setError(errorMessage);
      throw err;
    }
  };

  // Fetch entries when competitionId changes
  useEffect(() => {
    fetchPlayerEntries();
  }, [competitionId]);

  return {
    playerEntries,
    isLoading,
    error,
    insertPlayerEntry,
    refreshPlayerEntries: fetchPlayerEntries,
  };
}
