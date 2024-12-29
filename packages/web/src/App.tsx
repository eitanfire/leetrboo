import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Alert } from "reactstrap";
import { useAuth } from "./hooks/useAuth";
import LeetrbooApp from "./LeetrbooApp";
import {
  SignUpForm,
  SignInForm,
  RequestPasswordResetForm,
  SetNewPasswordForm,
} from "./components/AuthForms";
import { supabase } from "./services/supabaseClient";

type AuthView = "signin" | "signup" | "reset" | "set-new-password";

const App: React.FC = () => {
  const [view, setView] = useState<AuthView>("signin");
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null
  );
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const user = useAuth();

  useEffect(() => {
    const handlePasswordRecovery = async () => {
      try {
        // Get the hash fragment from the URL (excluding the '#' symbol)
        const hashFragment = window.location.hash.substring(1);

        // Parse the hash fragment
        const hashParams = new URLSearchParams(hashFragment);

        // Check if this is a recovery flow
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get("type");

        if (type === "recovery") {
          setIsPasswordReset(true);
          setView("set-new-password");

          // Clear the URL parameters but keep the hash
          const hash = window.location.hash;
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname + hash
          );
        }
      } catch (error) {
        console.error("Error handling password recovery:", error);
        setConfirmationMessage(
          "Error processing password reset. Please try again."
        );
      }
    };

    handlePasswordRecovery();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsPasswordReset(true);
        setView("set-new-password");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const renderAuthContent = () => {
    if (view === "set-new-password" && isPasswordReset) {
      return (
        <>
          <h2>Set a New Password</h2>
          <SetNewPasswordForm
            onSuccess={() => {
              setIsPasswordReset(false);
              setConfirmationMessage(
                "Your password has been updated! Please sign in with your new password."
              );
              setView("signin");
            }}
          />
        </>
      );
    }

    switch (view) {
      case "signup":
        return (
          <>
            <h2>Create an Account</h2>
            <SignUpForm
              onSuccess={() => {
                setConfirmationMessage(
                  "Account created! Please check your email to confirm your account."
                );
                setView("signin");
              }}
            />
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
            <RequestPasswordResetForm
              onSuccess={() => {
                setConfirmationMessage(
                  "If your email is registered, you will receive a password reset link."
                );
                setView("signin");
              }}
            />
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
            {confirmationMessage && (
              <Alert color="info" className="mt-3">
                {confirmationMessage}
              </Alert>
            )}
            <SignInForm
              onSuccess={() => {
                setConfirmationMessage(null);
              }}
            />
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
      {user == null || isPasswordReset ? (
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
