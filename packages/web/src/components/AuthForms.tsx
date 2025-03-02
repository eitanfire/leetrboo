import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Alert,
  Paper,
  Center,
  Image,
  BackgroundImage,
  Box,
} from "@mantine/core";

import {
  IconAlertCircle,
  IconCheck,
  IconEyeCheck,
  IconEyeOff,
} from "@tabler/icons-react";

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
  const { user } = useAuth();
  const [state, setState] = useState<AuthState>({
    email: "",
    password: "",
    loading: false,
    error: null,
    message: null,
  });

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

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
    <Paper component="form" onSubmit={handleSignIn} p="md">
      <Stack>
        {state.error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            className="error danger"
            title="Error"
          >
            {state.error}
          </Alert>
        )}
        {state.message && (
          <Alert
            icon={<IconCheck size={16} />}
            className="success"
            title="Success"
          >
            {state.message}
          </Alert>
        )}
        <TextInput
          className="input-field"
          label="Email"
          type="email"
          value={state.email}
          onChange={(e) =>
            setState((s) => ({ ...s, email: e.target.value.trim() }))
          }
          placeholder="Enter your email"
          required
        />
        <Box className="mt-4">
          <TextInput
            className="input-field"
            label="Password"
            value={state.password}
            onChange={(e) =>
              setState((s) => ({ ...s, password: e.target.value }))
            }
            placeholder="Enter your password"
            required
          />
        </Box>
        <Button
          className="sign-in-btn primary mt-4"
          type="submit"
          loading={state.loading}
        >
          {state.loading ? "Signing In..." : "Sign In"}
        </Button>
      </Stack>
    </Paper>
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
    <Paper component="form" onSubmit={handleSignUp} p="md">
      <Stack>
        {state.error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            className="error danger"
            title="Error"
          >
            {state.error}
          </Alert>
        )}
        {state.message && (
          <Alert
            icon={<IconCheck size={16} />}
            className="success"
            title="Success"
          >
            {state.message}
          </Alert>
        )}

        <TextInput
          className="input-field mb-4"
          label="Email"
          type="email"
          value={state.email}
          // className="ta-center"
          onChange={(e) =>
            setState((s) => ({ ...s, email: e.target.value.trim() }))
          }
          placeholder="Enter your email"
          required
        />

        <TextInput
          className="input-field mb-4"
          type="password"
          label="Password"
          value={state.password}
          onChange={(e) =>
            setState((s) => ({ ...s, password: e.target.value }))
          }
          placeholder="Enter your password"
          required
          minLength={6}
          // visibilityToggleIcon={({ reveal }) => (
          //   <div
          //     style={{
          //       position: "absolute",
          //       right: 10,
          //       top: "50%",
          //       transform: "translateY(-50%)",
          //     }}
          //   >
          //     {reveal ? (
          //       <IconEyeOff style={{ width: 20, height: 20 }} />
          //     ) : (
          //       <IconEyeCheck style={{ width: 20, height: 20 }} />
          //     )}
          //   </div>
          // )}
        />

        <Button
          className="sign-up-btn primary"
          type="submit"
          loading={state.loading}
        >
          {state.loading ? "Signing Up..." : "Sign Up"}
        </Button>
      </Stack>
    </Paper>
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
    <Paper component="form" onSubmit={handleResetRequest} p="md">
      <Stack>
        {state.error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            className="error danger"
            title="Error"
          >
            {state.error}
          </Alert>
        )}
        {state.message && (
          <Alert
            icon={<IconCheck size={16} />}
            className="success"
            title="Success"
          >
            {state.message}
          </Alert>
        )}

        <TextInput
          className="input-field mb-4"
          label="Email"
          type="email"
          value={state.email}
          onChange={(e) =>
            setState((s) => ({ ...s, email: e.target.value.trim() }))
          }
          placeholder="Enter your email"
          required
        />

        <Button
          className="primary reset-btn"
          type="submit"
          loading={state.loading}
        >
          {state.loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </Stack>
    </Paper>
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

      const params = new URLSearchParams(window.location.search);
      let token = params.get("token");

      if (!token) {
        const hash = window.location.hash;
        token = new URLSearchParams(hash.substring(1)).get("access_token");
      }

      if (!token) {
        throw new Error(
          "No reset token found. Please use the reset link from your email."
        );
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: state.password,
      });

      setState((s) => ({
        ...s,
        message: "Your password has been successfully updated!",
      }));

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
    <Paper component="form" onSubmit={handleSetPassword} p="md">
      <Stack>
        {state.error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            className="error danger"
            title="Error"
          >
            {state.error}
          </Alert>
        )}
        {state.message && (
          <Alert
            icon={<IconCheck size={16} />}
            className="success"
            title="Success"
          >
            {state.message}
          </Alert>
        )}

        <PasswordInput
          className="input-field"
          label="New Password"
          value={state.password}
          onChange={(e) =>
            setState((s) => ({ ...s, password: e.target.value }))
          }
          placeholder="Enter your new password"
          required
          minLength={6}
          visibilityToggleIcon={({ reveal }) => (
            <div className="icon-eye">
              {reveal ? <IconEyeOff /> : <IconEyeCheck />}
            </div>
          )}
        />

        <PasswordInput
          className="input-field"
          label="Confirm New Password"
          value={state.confirmPassword}
          onChange={(e) =>
            setState((s) => ({ ...s, confirmPassword: e.target.value }))
          }
          placeholder="Confirm your new password"
          required
          minLength={6}
          visibilityToggleIcon={({ reveal }) => (
            <div className="icon-eye">
              {reveal ? <IconEyeOff /> : <IconEyeCheck />}
            </div>
          )}
        />

        <Button className="primary" type="submit" loading={state.loading}>
          {state.loading ? "Updating..." : "Update Password"}
        </Button>
      </Stack>
    </Paper>
  );
};
