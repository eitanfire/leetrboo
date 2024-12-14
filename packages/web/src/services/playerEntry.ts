import { supabase } from "./supabaseClient";

export type PlayerEntry = {
    player_name: string;
    video_url: string;
}

export type PlayerEntryRow = PlayerEntry & {
    id: number;
}

export const listPlayerEntries = async (): Promise<PlayerEntryRow[]> => {
    const { data, error } = await supabase.from("player_entries").select("*");
    
    if (error) {
      console.error('Error fetching player entries:', error);
      return [];
    }
    
    return data as PlayerEntryRow[];
  };

export const insertPlayerEntry = async (data: PlayerEntry): Promise<void> => {
    await supabase.from("player_entries").insert(data);
}

export const countPlayerEntries = async (): Promise<number | null> => {
    const { count, error } = await supabase
      .from("player_entries")
      .select('*', { count: 'exact' });
  
    if (error) {
      console.error('Error counting player entries:', error);
      return null;
    }
  
    return count;
  };