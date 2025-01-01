import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export interface PlayerEntry {
  id?: number;
  player_name: string;
  video_url: string;
  competition_id?: number;
  created_at?: string;
}

export function usePlayerEntries() {
  const [playerEntries, setPlayerEntries] = useState<PlayerEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Get the user's single competition ID
  const getCurrentCompetition = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw new Error(userError.message);
    if (!user) throw new Error("No authenticated user found");

    const { data: competition, error: competitionError } = await supabase
      .from("competitions")
      .select("id")
      .eq("created_by", user.id)
      .single();

    if (competitionError && competitionError.code !== "PGRST116") {
      throw new Error(competitionError.message);
    }

    return competition;
  };

  // Fetch player entries
  const fetchPlayerEntries = async () => {
    try {
      setIsLoading(true);
      const competition = await getCurrentCompetition();

      if (!competition) {
        setPlayerEntries([]);
        return;
      }

      const { data: entries, error: entriesError } = await supabase
        .from("player_entries")
        .select("*")
        .eq("competition_id", competition.id)
        .order("id", { ascending: false }); // Order by ID instead of created_at

      if (entriesError) throw new Error(entriesError.message);
      setPlayerEntries(entries || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
      console.error("Error fetching entries:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayerEntries();

    // Set up real-time subscription for player entries
    const subscription = supabase
      .channel("player_entries_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "player_entries",
        },
        (payload) => {
          fetchPlayerEntries();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Insert new player entry
  const insertPlayerEntry = async (entry: PlayerEntry) => {
    const competition = await getCurrentCompetition();

    if (!competition) {
      throw new Error(
        "No competition found. Please create a competition first."
      );
    }

    const { data, error } = await supabase
      .from("player_entries")
      .insert([
        {
          player_name: entry.player_name,
          video_url: entry.video_url,
          competition_id: competition.id,
        },
      ])
      .select();

    if (error) {
      throw new Error(`Error inserting player entry: ${error.message}`);
    }

    await fetchPlayerEntries(); // Refresh the list after insertion
    return data;
  };

  return {
    playerEntries,
    isLoading,
    error,
    refreshEntries: fetchPlayerEntries,
    insertPlayerEntry,
  };
}
