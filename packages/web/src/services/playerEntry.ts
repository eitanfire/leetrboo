import { useState, useEffect } from 'react';
import { supabase } from "./supabaseClient";

export type PlayerEntry = {
  player_name: string;
  video_url: string;
};

export type PlayerEntryRow = PlayerEntry & {
  id: number;
};

// Fetch all player entries
export const listPlayerEntries = async (): Promise<PlayerEntryRow[]> => {
  const { data, error } = await supabase.from("player_entries").select("*");

  if (error) {
    console.error("Error fetching player entries:", error);
    return [];
  }

  return data as PlayerEntryRow[];
};

// Insert a new player entry
export const insertPlayerEntry = async (data: PlayerEntry): Promise<PlayerEntryRow | null> => {
  const { data: insertedData, error } = await supabase
    .from("player_entries")
    .insert(data)
    .select();

  if (error) {
    console.error("Error inserting player entry:", error);
    return null;
  }

  return insertedData[0] as PlayerEntryRow;
};

// Count total player entries
export const countPlayerEntries = async (): Promise<number | null> => {
  const { count, error } = await supabase
    .from("player_entries")
    .select("*", { count: "exact" });

  if (error) {
    console.error("Error counting player entries:", error);
    return null;
  }

  return count;
};

// Custom hook for managing player entries
export const usePlayerEntries = () => {
  const [playerEntries, setPlayerEntries] = useState<PlayerEntryRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  // Fetch all player entries and update count
  const fetchPlayerEntries = async () => {
    try {
      setIsLoading(true);
      const [entriesResult, countResult] = await Promise.all([
        supabase.from("player_entries").select("*"),
        supabase.from("player_entries").select("*", { count: "exact" })
      ]);

      if (entriesResult.error) throw entriesResult.error;
      if (countResult.error) throw countResult.error;

      setPlayerEntries(entriesResult.data as PlayerEntryRow[]);
      setTotalCount(countResult.count);
    } catch (err) {
      console.error("Error fetching player entries:", err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  // Insert a new player entry
  const insertPlayerEntry = async (data: PlayerEntry): Promise<PlayerEntryRow | null> => {
    try {
      const { data: insertedData, error } = await supabase
        .from("player_entries")
        .insert(data)
        .select();

      if (error) throw error;

      const newEntry = insertedData[0] as PlayerEntryRow;
      
      // Optimistically update the state
      setPlayerEntries(prev => [...prev, newEntry]);
      setTotalCount(prev => (prev !== null ? prev + 1 : 1));

      return newEntry;
    } catch (err) {
      console.error("Error inserting player entry:", err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      return null;
    }
  };

  // Fetch entries on component mount and set up real-time subscription
  useEffect(() => {
    // Fetch initial entries
    fetchPlayerEntries();

    // Set up real-time subscription
    const channel = supabase
      .channel('player_entries')
      .on(
        'postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'player_entries' },
        (payload) => {
          // Add new entry when inserted
          setPlayerEntries(prev => [...prev, payload.new as PlayerEntryRow]);
          setTotalCount(prev => (prev !== null ? prev + 1 : 1));
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    playerEntries,
    insertPlayerEntry,
    fetchPlayerEntries,
    isLoading,
    error,
    totalCount
  };
};