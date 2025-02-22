import React from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import { SignInForm } from "./components/AuthForms";
import { Text, Center, Grid } from "@mantine/core";

const SignIn: React.FC = () => {
  return (
    <Grid className="auth-container">
      <Grid.Col span={8}></Grid.Col>

      <h2>
        <Text mt="4" >
          Sign In
        </Text>
      </h2>
      <SignInForm />
      <div className="vstack mt-3 d-flex">
        {/* <Center> */}
          <Button
            // className="sign-up-btn"
            // className="submit-btn"
            color="primary"
            tag={Link}
            to="/signup"
          >
            Sign up
          </Button>
        {/* </Center> */}
        <Button
          className="
           mt-3
           "
          color="link"
          tag={Link}
          to="/reset-password"
        >
          Forgot Password
        </Button>
      </div>
    </Grid>
  );
};

export default SignIn;
