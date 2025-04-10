import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import { SignInForm } from "./components/AuthForms";
import { JoinCompetitionModal } from "./components/JoinCompetitionModal";

const SignIn: React.FC = () => {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  return (
    <>
      <h2>Sign In</h2>
      <SignInForm />
      <Button onClick={() => setIsJoinModalOpen(true)}>
        Enter a Competition
      </Button>
      <JoinCompetitionModal
        opened={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
      <div className="mt-3 d-flex justify-content-between">
        <Button color="link" tag={Link} to="/signup">
          Don't have an account? Sign up
        </Button>
        <Button color="link" tag={Link} to="/reset-password">
          Forgot Password?
        </Button>
      </div>
    </>
  );
};

export default SignIn;
