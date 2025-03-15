import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import {
  RequestPasswordResetForm,
  SetNewPasswordForm,
} from "./components/AuthForms";

const ResetPassword: React.FC = () => {
  const [isResetMode, setIsResetMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkResetSession = async () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.replace("#", ""));
      const type = params.get("type");

      if (type === "recovery") {
        setIsResetMode(true);
      } else {
        setIsResetMode(false);
      }
    };

    checkResetSession();
  }, [navigate]);

  return (
    <div className='auth-container'>
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
    </div>
  );
};

export default ResetPassword;
