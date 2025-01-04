import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../services/supabaseClient";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Full URL:", window.location.href);
    console.log("URL Hash:", window.location.hash);
    console.log("URL Search (query params):", window.location.search);
  }, []);
  
  useEffect(() => {
    // Get initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Don't set the user if we're in a password reset flow
      if (window.location.hash.includes("type=recovery")) {
        setUser(null);
      } else {
        setUser(session?.user ?? null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        // Sign out the user if we're in password recovery mode
        await supabase.auth.signOut();
        setUser(null);
      } else {
        setUser(session?.user ?? null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
};

console.log("URL Hash:", window.location.hash);