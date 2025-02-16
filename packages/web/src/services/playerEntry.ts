import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export interface PlayerEntry {
  id: string;
  player_name: string;
  video_url: string;
  score?: number;
  created_at: string;
  competition_id: string;
}

export function usePlayerEntries(competitionId?: string) {
  const [playerEntries, setPlayerEntries] = useState<PlayerEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayerEntries = async () => {
    if (!competitionId) {
      setPlayerEntries([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("player_entries")
        .select("*")
        .eq("competition_id", competitionId)
        .order("created_at", { ascending: false });

      if (supabaseError) throw supabaseError;

      setPlayerEntries(data as PlayerEntry[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const insertPlayerEntry = async (entryData: {
    player_name: string;
    video_url: string;
    competition_id: string;
  }): Promise<PlayerEntry> => {
    if (!competitionId) {
      throw new Error("No competition selected");
    }

    const { data, error: insertError } = await supabase
      .from("player_entries")
      .insert([entryData])
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return data as PlayerEntry;
  };

  useEffect(() => {
    // Initial fetch of player entries
    fetchPlayerEntries();

    // Set up real-time subscription for this competition
    if (competitionId) {
      const subscription = supabase
        .channel(`public:player_entries:competition_id=eq.${competitionId}`)
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "player_entries", filter: `competition_id=eq.${competitionId}` }, (payload) => {
          setPlayerEntries((current) => [
            payload.new as PlayerEntry,
            ...current,
          ]);
        })
        .on("postgres_changes", { event: "UPDATE", schema: "public", table: "player_entries", filter: `competition_id=eq.${competitionId}` }, (payload) => {
          setPlayerEntries((current) =>
            current.map((entry) =>
              entry.id === payload.new.id ? (payload.new as PlayerEntry) : entry
            )
          );
        })
        .on("postgres_changes", { event: "DELETE", schema: "public", table: "player_entries", filter: `competition_id=eq.${competitionId}` }, (payload) => {
          setPlayerEntries((current) =>
            current.filter((entry) => entry.id !== payload.old.id)
          );
        })
        .subscribe();

      // Clean up subscription when component unmounts or competitionId changes
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [competitionId]);

  return {
    playerEntries,
    isLoading,
    error,
    refreshPlayerEntries: fetchPlayerEntries,
    insertPlayerEntry,
  };
}
