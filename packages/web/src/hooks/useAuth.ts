import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../services/supabaseClient";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userPromise = supabase.auth.getUser();
    userPromise.then((userResponse: { data: { user: User | null } }) => {
      setUser(userResponse.data.user);
    });
  }, []);

  return user;
};
