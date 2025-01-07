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
  const [error, setError] = useState<string | null>(null);

  const fetchCompetition = async () => {
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

      const { data, error: supabaseError } = await supabase
        .from("competitions")
        .select("*")
        .eq("created_by", user.id)
        .single();

      if (supabaseError && supabaseError.code !== "PGRST116") {
        // PGRST116 is the "no rows returned" error
        setError(supabaseError.message);
        console.error("Error fetching competition:", supabaseError);
        return;
      }

      setCompetition(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Error fetching competition:", err);
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
        setError("No authenticated user found");
        return null;
      }

      // Check if user already has a competition
      const { data: existingCompetition, error: checkError } = await supabase
        .from("competitions")
        .select("*")
        .eq("created_by", user.id)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        setError(checkError.message);
        return null;
      }

      if (existingCompetition) {
        setError("You already have a competition created");
        return null;
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
        setError(createError.message);
        return null;
      }

      setCompetition(data);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error creating competition";
      setError(errorMessage);
      return null;
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
