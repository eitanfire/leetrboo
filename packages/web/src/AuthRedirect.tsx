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
  }, [navigate]);

  return (
    <div className="flex items-center justify-center p-4">
      <p>Redirecting...</p>
    </div>
  );
};
