// competitionService.ts
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export interface Competition {
  id: number;
  name: string;
  created_by: string;
  created_at: string;
}

export function useCompetitions() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCompetitions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setCompetitions([]); // Reset competitions when starting a new fetch

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("No authenticated user found");
      }

      const { data, error: supabaseError } = await supabase
        .from("competitions")
        .select("*")
        .order("created_at", { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      setCompetitions(data || []);
    } catch (err) {
      setCompetitions([]); // Reset competitions on error
      setError(err instanceof Error ? err : new Error("An error occurred"));
      console.error("Error fetching competitions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const createCompetition = async (
    name: string
  ): Promise<Competition | null> => {
    try {
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("No authenticated user found");
      }

      const { data, error: createError } = await supabase
        .from("competitions")
        .insert([
          {
            name,
            created_by: user.id,
          },
        ])
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      if (data) {
        setCompetitions((prev) => [data, ...prev]);
        return data;
      }
      throw new Error("No data returned from competition creation");
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Error creating competition")
      );
      return null;
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  return {
    competitions,
    isLoading,
    error,
    createCompetition,
    refreshCompetitions: fetchCompetitions,
  };
}

export interface PlayerEntry {
  id: number;
  competition_id: number;
  player_name: string;
  score: number;
}

export function usePlayerEntries(competitionId?: number) {
  const [playerEntries, setPlayerEntries] = useState<PlayerEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPlayerEntries = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setPlayerEntries([]); // Reset entries when starting a new fetch

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("No authenticated user found");
      }

      let query = supabase
        .from("player_entries")
        .select("*, competitions!inner(created_by)")
        .eq("competitions.created_by", user.id);

      if (competitionId) {
        query = query.eq("competition_id", competitionId);
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) {
        throw supabaseError;
      }

      setPlayerEntries(data || []);
    } catch (err) {
      setPlayerEntries([]); // Reset entries on error
      setError(err instanceof Error ? err : new Error("An error occurred"));
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
        .single();

      if (compError) {
        throw compError;
      }

      if (!competition) {
        throw new Error(
          "No competition found. Please create a competition first"
        );
      }

      const { data, error: insertError } = await supabase
        .from("player_entries")
        .insert([entry])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      if (!data) {
        throw new Error("No data returned from player entry creation");
      }

      setPlayerEntries((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Error inserting player entry")
      );
      return null;
    }
  };

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
