import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  TextInput,
  Button,
  Stack,
  Alert,
  Paper,
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
  emailError?: string | null;
  passwordError?: string | null;
  confirmPasswordError?: string | null;
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
    emailError: null,
    passwordError: null,
  });
  const [showPassword, setShowPassword] = useState(false);

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
    setState((s) => ({
      ...s,
      loading: true,
      error: null,
      emailError: null,
      passwordError: null,
    }));

    try {
      if (!state.email) {
        setState((s) => ({ ...s, emailError: "Email is required" }));
        throw new Error("Please enter both email and password");
      }

      if (!state.password) {
        setState((s) => ({ ...s, passwordError: "Password is required" }));
        throw new Error("Please enter both email and password");
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: state.email.trim(),
        password: state.password,
      });

      if (error) {
        if (error.message.toLowerCase().includes("email")) {
          setState((s) => ({ ...s, emailError: error.message }));
        } else if (error.message.toLowerCase().includes("password")) {
          setState((s) => ({ ...s, passwordError: error.message }));
        } else {
          setState((s) => ({ ...s, error: error.message }));
        }
        throw error;
      }

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
    <form onSubmit={handleSignIn}>
      <Paper p="md">
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
              setState((s) => ({
                ...s,
                email: e.target.value.trim(),
                emailError: null,
              }))
            }
            placeholder="Enter your email"
            required
            error={state.emailError}
          />
          <Box className="mt-4" style={{ position: "relative" }}>
            <TextInput
              className="input-field"
              label="Password"
              value={state.password}
              onChange={(e) =>
                setState((s) => ({
                  ...s,
                  password: e.target.value,
                  passwordError: null,
                }))
              }
              placeholder="Enter your password"
              required
              type={showPassword ? "text" : "password"}
              error={state.passwordError}
            />
            <div
              style={{
                position: "absolute",
                right: "4px",
                top: "75%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "30px",
                width: "30px",
              }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <IconEyeOff size={16} />
              ) : (
                <IconEyeCheck size={16} />
              )}
            </div>
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
    </form>
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
    emailError: null,
    passwordError: null,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setState((s) => ({
      ...s,
      loading: true,
      error: null,
      emailError: null,
      passwordError: null,
    }));

    try {
      if (!state.email) {
        setState((s) => ({ ...s, emailError: "Email is required" }));
        throw new Error("Please enter both email and password");
      }

      if (!state.password) {
        setState((s) => ({ ...s, passwordError: "Password is required" }));
        throw new Error("Please enter both email and password");
      }

      if (state.password.length < 6) {
        setState((s) => ({
          ...s,
          passwordError: "Password must be at least 6 characters long",
        }));
        throw new Error("Password must be at least 6 characters long");
      }

      const { error } = await supabase.auth.signUp({
        email: state.email,
        password: state.password,
        options: {
          emailRedirectTo: `${window.location.origin}/signin`,
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes("email")) {
          setState((s) => ({ ...s, emailError: error.message }));
        } else if (error.message.toLowerCase().includes("password")) {
          setState((s) => ({ ...s, passwordError: error.message }));
        } else {
          setState((s) => ({ ...s, error: error.message }));
        }
        throw error;
      }

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
    <form onSubmit={handleSignUp}>
      <Paper p="md">
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
              setState((s) => ({
                ...s,
                email: e.target.value.trim(),
                emailError: null,
              }))
            }
            placeholder="Enter your email"
            required
            error={state.emailError}
          />

          <Box style={{ position: "relative" }} className="mb-4">
            <TextInput
              className="input-field"
              label="Password"
              value={state.password}
              onChange={(e) =>
                setState((s) => ({
                  ...s,
                  password: e.target.value,
                  passwordError: null,
                }))
              }
              placeholder="Enter your password"
              required
              minLength={6}
              type={showPassword ? "text" : "password"}
              error={state.passwordError}
            />
            <div
              style={{
                position: "absolute",
                right: "4px",
                top: "75%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "30px",
                width: "30px",
              }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <IconEyeOff size={16} />
              ) : (
                <IconEyeCheck size={16} />
              )}
            </div>
          </Box>

          <Button
            className="sign-up-btn primary"
            type="submit"
            loading={state.loading}
          >
            {state.loading ? "Signing Up..." : "Sign Up"}
          </Button>
        </Stack>
      </Paper>
    </form>
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
    emailError: null,
  });

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setState((s) => ({
      ...s,
      loading: true,
      error: null,
      emailError: null,
    }));

    try {
      if (!state.email) {
        setState((s) => ({ ...s, emailError: "Email is required" }));
        throw new Error("Please enter your email address");
      }

      const { error } = await supabase.auth.resetPasswordForEmail(
        state.email.trim(),
        {
          redirectTo: `${window.location.origin}/set-new-password`,
        }
      );

      if (error) {
        setState((s) => ({ ...s, emailError: error.message }));
        throw error;
      }

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
    <form onSubmit={handleResetRequest}>
      <Paper p="md">
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
              setState((s) => ({
                ...s,
                email: e.target.value.trim(),
                emailError: null,
              }))
            }
            placeholder="Enter your email"
            required
            error={state.emailError}
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
    </form>
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
    passwordError: null,
    confirmPasswordError: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    setState((s) => ({
      ...s,
      loading: true,
      error: null,
      passwordError: null,
      confirmPasswordError: null,
    }));

    try {
      if (!state.password) {
        setState((s) => ({
          ...s,
          passwordError: "Please enter a new password",
        }));
        throw new Error("Please enter a new password");
      }

      if (state.password.length < 6) {
        setState((s) => ({
          ...s,
          passwordError: "Password must be at least 6 characters long",
        }));
        throw new Error("Password must be at least 6 characters long");
      }

      if (state.password !== state.confirmPassword) {
        setState((s) => ({
          ...s,
          confirmPasswordError: "Passwords do not match",
        }));
        throw new Error("Passwords do not match");
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

      if (updateError) {
        setState((s) => ({ ...s, passwordError: updateError.message }));
        throw updateError;
      }

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
    <form onSubmit={handleSetPassword}>
      <Paper p="md">
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

          <Box
            style={{ position: "relative" }}
            p="md"
            w="100%"
            maw="500px"
            className="mb-4"
          >
            <TextInput
              className="input-field"
              label="New Password"
              value={state.password}
              onChange={(e) =>
                setState((s) => ({
                  ...s,
                  password: e.target.value,
                  passwordError: null,
                }))
              }
              placeholder="Enter your new password"
              required
              minLength={6}
              type={showPassword ? "text" : "password"}
              error={state.passwordError}
            />
            <div
              style={{
                position: "absolute",
                left: "-7%",
                top: "75%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "30px",
                width: "30px",
              }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <IconEyeOff size={16} />
              ) : (
                <IconEyeCheck size={16} />
              )}
            </div>
          </Box>

          <Box style={{ position: "relative" }} className="mb-4">
            <TextInput
              className="input-field"
              label="Confirm New Password"
              value={state.confirmPassword}
              onChange={(e) =>
                setState((s) => ({
                  ...s,
                  confirmPassword: e.target.value,
                  confirmPasswordError: null,
                }))
              }
              placeholder="Confirm your new password"
              required
              minLength={6}
              type={showConfirmPassword ? "text" : "password"}
              error={state.confirmPasswordError}
            />
            <div
              style={{
                position: "absolute",
                left: "-7%",
                top: "75%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "30px",
                width: "30px",
              }}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <IconEyeOff size={16} />
              ) : (
                <IconEyeCheck size={16} />
              )}
            </div>
          </Box>

          <Button className="primary" type="submit" loading={state.loading}>
            {state.loading ? "Updating..." : "Update Password"}
          </Button>
        </Stack>
      </Paper>
    </form>
  );
};
