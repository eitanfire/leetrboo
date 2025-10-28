import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export interface PlayerEntry {
  id: string;
  player_name: string;
  video_url: string;
  score?: number;
  comments?: string;
  created_at: string;
  competition_id: string;
}

export function usePlayerEntries(competitionId?: string) {
  const [playerEntries, setPlayerEntries] = useState<PlayerEntry[]>([]);
  const [participantCount, setParticipantCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayerEntries = async () => {
    if (!competitionId) {
      setPlayerEntries([]);
      setParticipantCount(0);
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
      setParticipantCount(data.length);
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

  const deletePlayerEntry = async (entryId: string): Promise<void> => {
    const { error: deleteError } = await supabase
      .from("player_entries")
      .delete()
      .eq("id", entryId);

    if (deleteError) {
      throw deleteError;
    }

    // Manually update state as fallback if realtime doesn't trigger
    setPlayerEntries((current) =>
      current.filter((entry) => entry.id !== entryId)
    );
    setParticipantCount((currentCount) => currentCount - 1);
  };

  const updateComments = async (entryId: string, comments: string): Promise<void> => {
    console.log('Updating comments for entry:', entryId, 'with:', comments);

    const { data, error: updateError } = await supabase
      .from("player_entries")
      .update({ comments })
      .eq("id", entryId)
      .select();

    if (updateError) {
      console.error('Update comments error:', updateError);
      throw updateError;
    }

    console.log('Update successful, data:', data);

    // Manually update state as fallback if realtime doesn't trigger
    setPlayerEntries((current) =>
      current.map((entry) =>
        entry.id === entryId ? { ...entry, comments } : entry
      )
    );
  };

  useEffect(() => {
    fetchPlayerEntries();

    if (competitionId) {
      const subscription = supabase
        .channel(`public:player_entries:competition_id=eq.${competitionId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "player_entries",
            filter: `competition_id=eq.${competitionId}`,
          },
          (payload) => {
            setPlayerEntries((current) => [
              ...current,
              payload.new as PlayerEntry,
            ]);
            setParticipantCount((currentCount) => currentCount + 1);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "player_entries",
            filter: `competition_id=eq.${competitionId}`,
          },
          (payload) => {
            setPlayerEntries((current) =>
              current.map((entry) =>
                entry.id === payload.new.id
                  ? (payload.new as PlayerEntry)
                  : entry
              )
            );
          }
        )
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "player_entries",
            filter: `competition_id=eq.${competitionId}`,
          },
          (payload) => {
            console.log('DELETE event received:', payload);
            setPlayerEntries((current) =>
              current.filter((entry) => entry.id !== payload.old.id)
            );
            setParticipantCount((currentCount) => currentCount - 1);
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [competitionId]);

  return {
    playerEntries,
    participantCount,
    isLoading,
    error,
    refreshPlayerEntries: fetchPlayerEntries,
    insertPlayerEntry,
    deletePlayerEntry,
    updateComments,
  };
}
