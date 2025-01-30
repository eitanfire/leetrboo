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

      // If no competition is selected, don't fetch any entries
      if (!competitionId) {
        setPlayerEntries([]);
        return;
      }

      // First verify the competition belongs to the current user
      const { data: competition, error: compError } = await supabase
        .from("competitions")
        .select("id")
        .eq("id", competitionId)
        .eq("created_by", user.id)
        .maybeSingle();

      if (compError) {
        throw compError;
      }

      if (!competition) {
        setError("You don't have access to this competition");
        return;
      }

      const { data, error: entriesError } = await supabase
        .from("player_entries")
        .select("*")
        .eq("competition_id", competitionId)
        .order("created_at", { ascending: false });

      if (entriesError) {
        throw entriesError;
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
  ): Promise<PlayerEntry> => {
    try {
      setError(null);

      if (!entry.competition_id) {
        throw new Error("Competition ID is required");
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("No authenticated user found");
      }

      // Verify the competition belongs to the current user
      const { data: competition, error: compError } = await supabase
        .from("competitions")
        .select("id")
        .eq("id", entry.competition_id)
        .eq("created_by", user.id)
        .maybeSingle();

      if (compError || !competition) {
        throw new Error("You don't have access to this competition");
      }

      const { data, error: insertError } = await supabase
        .from("player_entries")
        .insert([entry])
        .select()
        .maybeSingle();

      if (insertError || !data) {
        throw insertError || new Error("Failed to insert player entry");
      }

      setPlayerEntries((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error inserting player entry";
      setError(errorMessage);
      throw new Error(errorMessage);
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
