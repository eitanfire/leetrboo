import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./services/supabaseClient";

export const AuthRedirect: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      try {
        // Get the URL hash
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );
        const type = hashParams.get("type");
        const access_token = hashParams.get("access_token");

        if (type === "recovery" && access_token) {
          // Set the session with the recovery token
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token: access_token, // Supabase uses the same token for recovery
          });

          if (error) throw error;

          // Now redirect to reset password page
          navigate("/set-new-password", { replace: true });
        } else {
          // For other auth redirects, check session
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (session) {
            navigate("/", { replace: true });
          } else {
            navigate("/signin", { replace: true });
          }
        }
      } catch (error) {
        console.error("Auth redirect error:", error);
        navigate("/signin", {
          replace: true,
          state: {
            error: "Invalid or expired reset link. Please try again.",
          },
        });
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
