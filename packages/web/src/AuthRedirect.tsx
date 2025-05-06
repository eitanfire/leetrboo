import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./services/supabaseClient";

export const AuthRedirect: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        navigate("/", { replace: true });
      } else {
        navigate("/signin", { replace: true });
      }
    };

    handleAuthRedirect();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/", { replace: true });
      } else {
        navigate("/signin", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center p-4">
      <p>Redirecting...</p>
    </div>
  );
};
