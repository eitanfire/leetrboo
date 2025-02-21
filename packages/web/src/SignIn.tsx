import React from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import { SignInForm } from "./components/AuthForms";

const SignIn: React.FC = () => {
  return (
    <div className='auth-container'>
      <h2>Sign In</h2>
      <SignInForm />
      <div className="mt-3 d-flex justify-content-between">
        <Button color="link" tag={Link} to="/signup">
          Don't have an account? Sign up
        </Button>
        <Button color="link" tag={Link} to="/reset-password">
          Forgot Password?
        </Button>
      </div>
    </div>
  );
};

export default SignIn;
