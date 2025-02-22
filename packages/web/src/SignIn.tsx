import React from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import { SignInForm } from "./components/AuthForms";
import Brand from "../../web/src/assets/leetrboo_brand_bg.png";
import {
  Image, Text,
} from "@mantine/core";

const SignIn: React.FC = () => {
  return (
    <div className="auth-container">
      <h1>
        <Text fw={900}>leetrboo</Text>
      </h1>
      <Image radius="md" height={180} src={Brand} alt="boo!" />
      <h2>
        <Text mt="4" className="signin-btn">
          Sign In
        </Text>
      </h2>
      <SignInForm />
      <div className="mt-3 d-flex">
        <Button className="submit-btn" color="primary" tag={Link} to="/signup">
          Sign up
        </Button>
        <Button
          className="reset-btn mt-3"
          color="danger"
          outline
          tag={Link}
          to="/reset-password"
        >
          Forgot Password
        </Button>
      </div>
    </div>
  );
};

export default SignIn;
