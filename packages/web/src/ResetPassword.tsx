import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import {
  RequestPasswordResetForm,
  SetNewPasswordForm,
} from "./components/AuthForms";
import { supabase } from "../src/services/supabaseClient";

const ResetPassword: React.FC = () => {
  const [isResetMode, setIsResetMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkResetSession = async () => {
      // Check if we're accessing this page with a recovery token
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.replace("#", ""));
      const type = params.get("type");

      // If we have a recovery token, show the password reset form
      if (type === "recovery") {
        setIsResetMode(true);
      } else {
        // If accessed directly without token, show the request reset form
        setIsResetMode(false);
      }
    };

    checkResetSession();
  }, [navigate]);

  return (
    <>
      <h2>{isResetMode ? "Set New Password" : "Reset Password"}</h2>
      {isResetMode ? (
        <SetNewPasswordForm />
      ) : (
        <>
          <RequestPasswordResetForm />
          <Button color="link" className="mt-3" tag={Link} to="/signin">
            Back to Sign In
          </Button>
        </>
      )}
    </>
  );
};

export default ResetPassword;
