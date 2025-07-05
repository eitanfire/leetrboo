import React from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import { SignUpForm } from "./components/AuthForms";
import { Text } from "@mantine/core";

const SignUp: React.FC = () => {
  return (
    <div className="auth-container">
      <Text mt="4" c="black" fz="5rem" fw={1000}>
        <h2>Create an Account</h2>
      </Text>
      <SignUpForm />
      <Button color="link" className="mt-3" tag={Link} to="/signin">
        Already have an account? Sign in
      </Button>
    </div>
  );
};

export default SignUp;
