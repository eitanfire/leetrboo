// ResetPassword.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import { RequestPasswordResetForm } from "./components/AuthForms";

const ResetPassword: React.FC = () => {
  return (
    <>
      <h2>Reset Password</h2>
      <RequestPasswordResetForm />
      <Button color="link" className="mt-3" tag={Link} to="/signin">
        Back to Sign In
      </Button>
    </>
  );
};

export default ResetPassword;
