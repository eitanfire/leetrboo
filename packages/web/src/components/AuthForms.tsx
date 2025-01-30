import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { Button, Form, FormGroup, Label, Input, Alert } from "reactstrap";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthFormProps {
  onSuccess?: () => void;
}

interface AuthState {
  email: string;
  password: string;
  confirmPassword?: string;
  loading: boolean;
  error: string | null;
  message: string | null;
}

export const SignInForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState<AuthState>({
    email: "",
    password: "",
    loading: false,
    error: null,
    message: null,
  });

  useEffect(() => {
    if (location.state?.message) {
      setState((s) => ({ ...s, message: location.state.message }));
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      if (!state.email || !state.password) {
        throw new Error("Please enter both email and password");
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: state.email.trim(),
        password: state.password,
      });

      if (error) throw error;

      if (onSuccess) onSuccess();
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setState((s) => ({
        ...s,
        error: error instanceof Error ? error.message : "Failed to sign in",
      }));
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  };

  return (
    <Form onSubmit={handleSignIn}>
      {state.error && (
        <Alert color="danger" timeout={300}>
          {state.error}
        </Alert>
      )}
      {state.message && (
        <Alert color="success" timeout={300}>
          {state.message}
        </Alert>
      )}

      <FormGroup>
        <Label for="signinEmail">Email</Label>
        <Input
          id="signinEmail"
          type="email"
          value={state.email}
          onChange={(e) =>
            setState((s) => ({ ...s, email: e.target.value.trim() }))
          }
          placeholder="Enter your email"
          required
        />
      </FormGroup>

      <FormGroup>
        <Label for="signinPassword">Password</Label>
        <Input
          id="signinPassword"
          type="password"
          value={state.password}
          onChange={(e) =>
            setState((s) => ({ ...s, password: e.target.value }))
          }
          placeholder="Enter your password"
          required
        />
      </FormGroup>

      <Button
        className="sign-in-btn outline"
        type="submit"
        disabled={state.loading}
        color="primary"
        block
      >
        {state.loading ? "Signing In..." : "Sign In"}
      </Button>
    </Form>
  );
};

export const SignUpForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({
    email: "",
    password: "",
    loading: false,
    error: null,
    message: null,
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      if (!state.email || !state.password) {
        throw new Error("Please enter both email and password");
      }

      const { error } = await supabase.auth.signUp({
        email: state.email,
        password: state.password,
        options: {
          emailRedirectTo: `${window.location.origin}/signin`,
        },
      });

      if (error) throw error;

      setState((s) => ({
        ...s,
        message: "Success! Please check your email for the confirmation link.",
      }));

      if (onSuccess) onSuccess();
      navigate("/signin", {
        replace: true,
        state: {
          message: "Please check your email for the confirmation link.",
        },
      });
    } catch (error) {
      setState((s) => ({
        ...s,
        error:
          error instanceof Error
            ? error.message
            : "An error occurred during sign up",
      }));
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  };

  return (
    <Form onSubmit={handleSignUp}>
      {state.error && (
        <Alert color="danger" timeout={300}>
          {state.error}
        </Alert>
      )}
      {state.message && (
        <Alert color="success" timeout={300}>
          {state.message}
        </Alert>
      )}

      <FormGroup>
        <Label for="signupEmail">Email</Label>
        <Input
          id="signupEmail"
          type="email"
          value={state.email}
          onChange={(e) =>
            setState((s) => ({ ...s, email: e.target.value.trim() }))
          }
          placeholder="Enter your email"
          required
        />
      </FormGroup>

      <FormGroup>
        <Label for="signupPassword">Password</Label>
        <Input
          id="signupPassword"
          type="password"
          value={state.password}
          onChange={(e) =>
            setState((s) => ({ ...s, password: e.target.value }))
          }
          placeholder="Enter your password"
          required
          minLength={6}
        />
      </FormGroup>

      <Button
        className="sign-up-btn outline"
        type="submit"
        disabled={state.loading}
        color="primary"
        block
      >
        {state.loading ? "Signing Up..." : "Sign Up"}
      </Button>
    </Form>
  );
};

export const RequestPasswordResetForm: React.FC<AuthFormProps> = ({
  onSuccess,
}) => {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({
    email: "",
    password: "",
    loading: false,
    error: null,
    message: null,
  });

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        state.email.trim(),
        {
          redirectTo: `${window.location.origin}/set-new-password`,
        }
      );

      if (error) throw error;

      setState((s) => ({
        ...s,
        message: "Please check your email for the password reset link.",
      }));
    } catch (error) {
      setState((s) => ({
        ...s,
        error:
          error instanceof Error ? error.message : "Failed to send reset email",
      }));
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  };

  return (
    <Form onSubmit={handleResetRequest}>
      {state.error && (
        <Alert color="danger" timeout={300}>
          {state.error}
        </Alert>
      )}
      {state.message && (
        <Alert color="success" timeout={300}>
          {state.message}
        </Alert>
      )}

      <FormGroup>
        <Label for="resetEmail">Email</Label>
        <Input
          id="resetEmail"
          type="email"
          value={state.email}
          onChange={(e) =>
            setState((s) => ({ ...s, email: e.target.value.trim() }))
          }
          placeholder="Enter your email"
          required
        />
      </FormGroup>

      <Button
        className="reset-btn outline"
        color="primary"
        type="submit"
        disabled={state.loading}
        block
      >
        {state.loading ? "Sending..." : "Send Reset Link"}
      </Button>
    </Form>
  );
};

export const SetNewPasswordForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({
    email: "",
    password: "",
    confirmPassword: "",
    loading: false,
    error: null,
    message: null,
  });

  // Add session check
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setState((s) => ({
          ...s,
          error:
            "Auth session missing! Please use the reset link from your email.",
        }));
      }
    };

    checkSession();
  }, []);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      if (state.password !== state.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (!state.password) {
        throw new Error("Please enter a new password");
      }

      if (state.password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      // First try to get the token from the URL parameters
      const params = new URLSearchParams(window.location.search);
      let token = params.get("token");

      // If no token in URL params, try the hash
      if (!token) {
        const hash = window.location.hash;
        token = new URLSearchParams(hash.substring(1)).get("access_token");
      }

      if (!token) {
        throw new Error(
          "No reset token found. Please use the reset link from your email."
        );
      }

      // Try updating with the token
      const { error: updateError } = await supabase.auth.updateUser({
        password: state.password,
      });

      setState((s) => ({
        ...s,
        message: "Your password has been successfully updated!",
      }));

      // Sign out and redirect to signin page after a short delay
      setTimeout(async () => {
        await supabase.auth.signOut();
        navigate("/signin", {
          replace: true,
          state: {
            message:
              "Your password has been updated! Please sign in with your new password.",
          },
        });
      }, 2000);

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Password reset error:", error);
      setState((s) => ({
        ...s,
        error:
          error instanceof Error ? error.message : "Failed to reset password",
      }));
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  };

  return (
    <Form onSubmit={handleSetPassword}>
      {state.error && (
        <Alert color="danger" timeout={300}>
          {state.error}
        </Alert>
      )}
      {state.message && (
        <Alert color="success" timeout={300}>
          {state.message}
        </Alert>
      )}

      <FormGroup>
        <Label for="newPassword">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          value={state.password}
          onChange={(e) =>
            setState((s) => ({ ...s, password: e.target.value }))
          }
          placeholder="Enter your new password"
          required
          minLength={6}
        />
      </FormGroup>

      <FormGroup>
        <Label for="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={state.confirmPassword}
          onChange={(e) =>
            setState((s) => ({ ...s, confirmPassword: e.target.value }))
          }
          placeholder="Confirm your new password"
          required
          minLength={6}
        />
      </FormGroup>

      <Button
        className="reset-btn outline"
        type="submit"
        disabled={state.loading}
        color="success"
        block
      >
        {state.loading ? "Updating..." : "Update Password"}
      </Button>
    </Form>
  );
};
