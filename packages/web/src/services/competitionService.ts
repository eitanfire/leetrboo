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
  // Option 1: 6-digit numeric code
  return Math.floor(100000 + Math.random() * 900000).toString();

  // Option 2: 4-character alphanumeric (uncomment to use instead)
  // const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // Avoiding confusing chars
  // return Array.from({length: 4}, () =>
  //   chars.charAt(Math.floor(Math.random() * chars.length))
  // ).join('');

  // Option 3: Word + Number format (uncomment to use instead)
  // const words = ['GAME', 'PLAY', 'CODE', 'TEAM', 'QUIZ', 'MEET', 'JOIN'];
  // const word = words[Math.floor(Math.random() * words.length)];
  // const num = Math.floor(10 + Math.random() * 90);
  // return `${word}${num}`;
}

// Function to check if code already exists
async function isCodeUnique(code: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("competitions")
    .select("id")
    .eq("competition_code", code)
    .limit(1);

  if (error) throw error;
  return data.length === 0;
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
      // Generate unique competition code
      const competitionCode = await generateUniqueCompetitionCode();

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

      if (createError) throw createError;

      // Refresh the list after creating
      await fetchCompetitions();

      return data as Competition;
    } catch (error) {
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
