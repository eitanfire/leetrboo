import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export interface Competition {
  id: number;
  name: string;
  created_at: string;
  created_by: string;
  competition_code: string;
}

export function useCompetitions() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCompetitions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("competitions")
        .select("*")
        .order("created_at", { ascending: false });

      if (supabaseError) throw supabaseError;

      setCompetitions(data as Competition[]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
    } finally {
      setIsLoading(false);
    }
  };

  const createCompetition = async (name: string) => {
    try {
      // Let the database handle competition_code generation (back to original behavior)
      const { data, error: createError } = await supabase
        .from("competitions")
        .insert([{ name }])
        .select()
        .single();

      if (createError) {
        console.error("Error creating competition:", createError);
        throw createError;
      }

      // Refresh the list after creating
      await fetchCompetitions();

      return data as Competition;
    } catch (error) {
      console.error("Error in createCompetition:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to create competition");
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  return {
    competitions,
    isLoading,
    error,
    refreshCompetitions: fetchCompetitions,
    createCompetition,
  };
}
