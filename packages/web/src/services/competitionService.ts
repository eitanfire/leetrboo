// services/competitionService.ts
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export interface Competition {
  id: number;
  name: string;
  created_by: string;
  created_at: string;
}

export function useCompetition() {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCompetition = async () => {
    try {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No authenticated user found");

      const { data, error } = await supabase
        .from("competitions")
        .select("*")
        .eq("created_by", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 is the "no rows returned" error
        throw error;
      }

      setCompetition(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
      console.error("Error fetching competition:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const createCompetition = async (name: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No authenticated user found");

      // Check if user already has a competition
      const { data: existingCompetition } = await supabase
        .from("competitions")
        .select("*")
        .eq("created_by", user.id)
        .single();

      if (existingCompetition) {
        throw new Error("You already have a competition created");
      }

      const { data, error } = await supabase
        .from("competitions")
        .insert([
          {
            name,
            created_by: user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setCompetition(data);
      return data;
    } catch (err) {
      throw err instanceof Error
        ? err
        : new Error("Error creating competition");
    }
  };

  useEffect(() => {
    fetchCompetition();
  }, []);

  return {
    competition,
    isLoading,
    error,
    createCompetition,
    refreshCompetition: fetchCompetition,
  };
}
