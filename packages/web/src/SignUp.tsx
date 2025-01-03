// SignUp.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import { SignUpForm } from "./components/AuthForms";

const SignUp: React.FC = () => {
  return (
    <>
      <h2>Create an Account</h2>
      <SignUpForm />
      <Button color="link" className="mt-3" tag={Link} to="/signin">
        Already have an account? Sign in
      </Button>
    </>
  );
};

export default SignUp;
