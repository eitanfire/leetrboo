import { supabase } from "./supabaseClient";

export type PlayerEntry = {
    player_name: string;
    video_url: string;
}

export type PlayerEntryRow = PlayerEntry & {
    id: number;
}

export const listPlayerEntries = async (): Promise<PlayerEntryRow[]> => {
    const result = await supabase.from("player_entries").select("*");
    return result.data as PlayerEntryRow[];
}

export const insertPlayerEntry = async (data: PlayerEntry): Promise<void> => {
    await supabase.from("player_entries").insert(data);
}