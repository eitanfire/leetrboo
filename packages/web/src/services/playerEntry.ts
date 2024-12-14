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

// Optional: Custom hook if you want to use it
export const usePlayerEntries = () => {
  const [playerEntries, setPlayerEntries] = useState<PlayerEntryRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  // Fetch all player entries
  const fetchPlayerEntries = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.from("player_entries").select("*");

      if (error) throw error;

      setPlayerEntries(data as PlayerEntryRow[]);
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
      setPlayerEntries(prev => [...prev, newEntry]);
      return newEntry;
    } catch (err) {
      console.error("Error inserting player entry:", err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      return null;
    }
  };

  // Count total player entries
  const countPlayerEntries = async () => {
    try {
      const { count, error } = await supabase
        .from("player_entries")
        .select("*", { count: "exact" });

      if (error) throw error;

      setTotalCount(count);
      return count;
    } catch (err) {
      console.error("Error counting player entries:", err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      return null;
    }
  };

  // Fetch entries on component mount
  useEffect(() => {
    fetchPlayerEntries();
  }, []);

  return {
    playerEntries,
    insertPlayerEntry,
    countPlayerEntries,
    fetchPlayerEntries,
    isLoading,
    error,
    totalCount
  };
};