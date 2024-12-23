import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, { useState } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { useAuth } from "./hooks/useAuth";
import LeetrbooApp from "./LeetrbooApp";
import {
  SignUpForm,
  SignInForm,
  ResetPasswordForm,
} from "./components/AuthForms";

type AuthView = "signin" | "signup" | "reset";

const App: React.FC = () => {
  const [view, setView] = useState<AuthView>("signin");
  const user = useAuth();

  const renderAuthContent = () => {
    switch (view) {
      case "signup":
        return (
          <>
            <h2>Create an Account</h2>
            <SignUpForm onSuccess={() => setView("signin")} />
            <Button
              color="link"
              className="mt-3"
              onClick={() => setView("signin")}
            >
              Already have an account? Sign in
            </Button>
          </>
        );
      case "reset":
        return (
          <>
            <h2>Reset Password</h2>
            <ResetPasswordForm onSuccess={() => setView("signin")} />
            <Button
              color="link"
              className="mt-3"
              onClick={() => setView("signin")}
            >
              Back to Sign In
            </Button>
          </>
        );
      default:
        return (
          <>
            <h2>Sign In</h2>
            <SignInForm onSuccess={() => {}} />
            <div className="mt-3 d-flex justify-content-between">
              <Button color="link" onClick={() => setView("signup")}>
                Don't have an account? Sign up
              </Button>
              <Button color="link" onClick={() => setView("reset")}>
                Forgot Password?
              </Button>
            </div>
          </>
        );
    }
  };

  return (
    <Container fluid className="p-0">
      {user == null ? (
        <Container className="mt-5">
          <Row className="justify-content-center">
            <Col md={6}>{renderAuthContent()}</Col>
          </Row>
        </Container>
      ) : (
        <div>
          <LeetrbooApp />
        </div>
      )}
    </Container>
  );
};

export default App;
