import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export interface Competition {
  id: number;
  name: string;
  created_at: string;
  created_by: string;
  competition_code: string;
}

// Function to generate short competition codes
function generateShortCompetitionCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to check if code already exists
async function isCodeUnique(code: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("competitions")
      .select("id")
      .eq("competition_code", code)
      .limit(1);

    if (error) {
      console.error("Error checking code uniqueness:", error);
      throw error;
    }

    return data === null || data.length === 0;
  } catch (error) {
    console.error("Failed to check code uniqueness:", error);
    // If we can't check uniqueness, assume it's not unique to be safe
    return false;
  }
}

// Function to generate unique competition code
async function generateUniqueCompetitionCode(): Promise<string> {
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const code = generateShortCompetitionCode();

    if (await isCodeUnique(code)) {
      return code;
    }

    attempts++;
  }

  // Fallback: add timestamp suffix if we can't find unique code
  const timestamp = Date.now().toString().slice(-4);
  return generateShortCompetitionCode() + timestamp.slice(-2);
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
      const competitionCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      const { data, error: createError } = await supabase
        .from("competitions")
        .insert([
          {
            name,
            competition_code: competitionCode,
          },
        ])
        .select()
        .single();

      if (createError) {
        // If there's a unique constraint error, try with a different code
        if (createError.code === "23505") {
          // PostgreSQL unique violation
          const newCode = Math.floor(
            100000 + Math.random() * 900000
          ).toString();
          const { data: retryData, error: retryError } = await supabase
            .from("competitions")
            .insert([
              {
                name,
                competition_code: newCode,
              },
            ])
            .select()
            .single();

          if (retryError) throw retryError;
          await fetchCompetitions();
          return retryData as Competition;
        }
        throw createError;
      }

      // Refresh the list after creating
      await fetchCompetitions();

      return data as Competition;
    } catch (error) {
      console.error("Error creating competition:", error);
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
