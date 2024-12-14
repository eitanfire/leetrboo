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
