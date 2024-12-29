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
  confirmPassword?: string;
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

      const { error } = await supabase.auth.signUp({
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

      const { error } = await supabase.auth.signInWithPassword({
        email: state.email.trim(),
        password: state.password,
      });

      if (error) throw error;

      if (onSuccess) onSuccess();
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

      <Button
      className="sign-in-btn outline"
        type="submit"
        disabled={state.loading}
        color="success"
        block
      >
        {state.loading ? "Signing In..." : "Sign In"}
      </Button>
    </Form>
  );
};

// Password Reset Request Form Component
export const RequestPasswordResetForm: React.FC<AuthFormProps> = ({
  onSuccess,
}) => {
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
      if (!state.email) {
        throw new Error("Please enter your email address");
      }

      const { error } = await supabase.auth.resetPasswordForEmail(
        state.email.trim(),
        {
          redirectTo: `${window.location.origin}/auth?type=recovery`,
        }
      );

      if (error) throw error;

      setState((s) => ({
        ...s,
        message: "Please check your email for the password reset link.",
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
    <Form onSubmit={handleResetRequest}>
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

      <Button className="reset-btn outline" color="danger "type="submit" disabled={state.loading} block>
        {state.loading ? "Sending..." : "Send Reset Link"}
      </Button>
    </Form>
  );
};

// Set New Password Form Component
export const SetNewPasswordForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const [state, setState] = useState<AuthState>({
    email: "",
    password: "",
    confirmPassword: "",
    loading: false,
    error: null,
    message: null,
  });

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      // Validate password and confirmation match
      if (state.password !== state.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (!state.password) {
        throw new Error("Please enter a new password");
      }

      // Minimum password requirements
      if (state.password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      // Get the current session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // If no session, try to exchange the recovery token for a session
        const hashFragment = window.location.hash.substring(1);
        const hashParams = new URLSearchParams(hashFragment);
        const accessToken = hashParams.get("access_token");

        if (!accessToken) {
          throw new Error(
            "No recovery token found. Please try resetting your password again."
          );
        }

        // Set the access token
        const { error: setSessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: "",
        });

        if (setSessionError) {
          throw setSessionError;
        }
      }

      // Now update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: state.password,
      });

      if (updateError) throw updateError;

      setState((s) => ({
        ...s,
        message: "Your password has been successfully updated!",
        password: "",
        confirmPassword: "",
      }));

      if (onSuccess) {
        onSuccess();
      }

      // Sign out after successful password update
      await supabase.auth.signOut();
    } catch (error) {
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
      {state.error && <Alert color="danger">{state.error}</Alert>}
      {state.message && <Alert color="success">{state.message}</Alert>}

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
        className="sign-in-btn outline"
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
