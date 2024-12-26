import React, { useState } from "react";
import { supabase } from "../services/supabaseClient";
import { Button, Form, FormGroup, Label, Input, Alert } from "reactstrap";

// Types
interface AuthFormProps {
  onSuccess?: () => void;
}

interface AuthState {
  email: string;
  password: string;
  loading: boolean;
  error: string | null;
  message: string | null;
}

// Sign Up Form Component
export const SignUpForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
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

      const { data, error } = await supabase.auth.signUp({
        email: state.email,
        password: state.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
        },
      });

      if (error) throw error;

      setState((s) => ({
        ...s,
        message: "Success! Please check your email for the confirmation link.",
      }));
      if (onSuccess) onSuccess();
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
      {state.error && <Alert color="danger">{state.error}</Alert>}
      {state.message && <Alert color="success">{state.message}</Alert>}

      <FormGroup>
        <Label for="signupEmail">Email</Label>
        <Input
          id="signupEmail"
          type="email"
          value={state.email}
          onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
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

      <Button className="submit-btn" type="submit" disabled={state.loading} block>
        {state.loading ? "Creating Account..." : "Sign Up"}
      </Button>
    </Form>
  );
};

// Sign In Form Component
export const SignInForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const [state, setState] = useState<AuthState>({
    email: "",
    password: "",
    loading: false,
    error: null,
    message: null,
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      if (!state.email || !state.password) {
        throw new Error("Please enter both email and password");
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: state.email.trim(),
        password: state.password,
      });

      if (error) {
        if (error.message === "Invalid login credentials") {
          throw new Error("Incorrect email or password");
        }
        throw error;
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Sign in error:", error);
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
      {state.error && <Alert color="danger">{state.error}</Alert>}

      <FormGroup>
        <Label for="signinEmail">Email</Label>
        <Input
          id="signinEmail"
          type="email"
          value={state.email}
          onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
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

      <Button type="submit" disabled={state.loading} >
        {state.loading ? "Signing In..." : "Sign In"}
      </Button>
    </Form>
  );
};

// Password Reset Form Component
export const ResetPasswordForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const [state, setState] = useState<AuthState>({
    email: "",
    password: "",
    loading: false,
    error: null,
    message: null,
  });

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      if (!state.email) {
        throw new Error("Please enter your email address");
      }

      const { error } = await supabase.auth.resetPasswordForEmail(
        state.email.trim(),
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        }
      );

      if (error) throw error;

      setState((s) => ({
        ...s,
        message:
          "If an account exists with this email, you will receive a password reset link.",
      }));
      if (onSuccess) onSuccess();
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
    <Form onSubmit={handleReset}>
      {state.error && <Alert color="danger">{state.error}</Alert>}
      {state.message && <Alert color="success">{state.message}</Alert>}

      <FormGroup>
        <Label for="resetEmail">Email</Label>
        <Input
          id="resetEmail"
          type="email"
          value={state.email}
          onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
          placeholder="Enter your email"
          required
        />
      </FormGroup>

      <Button color="primary" type="submit" disabled={state.loading} block>
        {state.loading ? "Sending Reset Link..." : "Reset Password"}
      </Button>
    </Form>
  );
};
