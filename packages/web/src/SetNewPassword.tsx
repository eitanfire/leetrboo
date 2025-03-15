import React from "react";
import { SetNewPasswordForm } from "./components/AuthForms";

const SetNewPassword: React.FC = () => {
  return (
    <div className="auth-container">
      <h2>Set a New Password</h2>
      <SetNewPasswordForm />
    </div>
  );
};

export default SetNewPassword;
