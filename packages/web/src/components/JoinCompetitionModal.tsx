// src/components/JoinCompetitionModal.tsx
import React, { useState } from "react";
// import { createStyles } from "@mantine/styles";
import { Modal, Text } from "@mantine/core";
import { supabase } from "../services/supabaseClient";
import { JoinCompetitionForm } from "./JoinCompetitionForm";

interface JoinCompetitionModalProps {
  opened: boolean;
  onClose: () => void;
  zIndex?: number;
}

export function JoinCompetitionModal({
  opened,
  onClose,
  zIndex = 1000, // Default zIndex if not provided
}: JoinCompetitionModalProps) {
  const [step, setStep] = useState<"enterCode" | "enterDetails">("enterCode");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState("");

  // Form for entering the invite code
  const codeForm = useForm({
    initialValues: { code: "" },
    validate: {
      code: (value) => (value.trim() ? null : "Invite code is required"),
    },
  });

  // Form for entering player details
  const detailsForm = useForm({
    initialValues: { playerName: "", videoUrl: "" },
    validate: {
      playerName: (value) => (value.trim() ? null : "Your name is required"),
      videoUrl: (value) => {
        if (!value.trim()) return "Video URL is required";
        // Basic URL validation
        try {
          new URL(value);
          // Optional: Add more specific checks like requiring https://
          if (!value.startsWith("https://") && !value.startsWith("http://")) {
            return "URL must start with http:// or https://";
          }
          return null;
        } catch (_) {
          return "Please enter a valid URL (e.g., https://...)";
        }
      },
    },
  });

  // Handler for submitting the invite code
  const handleCodeSubmit = (values: { code: string }) => {
    setError(null);
    setSuccess(null);
    setInviteCode(values.code.trim()); // Trim the code
    setStep("enterDetails"); // Move to the next step
  };

  // Handler for submitting player details
  const handleDetailsSubmit = async (values: {
    playerName: string;
    videoUrl: string;
  }) => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (!inviteCode) {
      console.error("Submission attempted without an invite code.");
      setError("Invite code missing. Please go back and enter it.");
      setIsLoading(false);
      return; // Stop execution if invite code is missing
    }

    try {
      console.log("Calling Supabase RPC 'join_competition' with:", {
        code: inviteCode,
        player_name: values.playerName.trim(), // Trim values before sending
        video_url: values.videoUrl.trim(),
      });

      // Call the Supabase function
      const { error: rpcError } = await supabase.rpc("join_competition", {
        code: inviteCode,
        player_name: values.playerName.trim(),
        video_url: values.videoUrl.trim(),
      });

      console.log("Supabase RPC response error object:", rpcError);

      if (rpcError) {
        console.error("Supabase RPC Error details:", rpcError);
        // Provide user-friendly error messages based on Supabase response
        if (rpcError.message.includes("Competition code does not exist")) {
          setError(
            "Invalid or expired invite code. Please check the code and try again."
          );
        } else if (rpcError.message.includes("value too long")) {
          setError("One of the fields entered is too long. Please shorten it.");
        } else if (rpcError.message.includes("already joined")) {
          // Example: Handle custom error
          setError("You have already joined this competition.");
        } else {
          // Generic error for other unexpected issues
          setError(
            `Failed to join competition due to an error. Please try again later.`
          );
        }
      } else {
        // Success case
        setSuccess("Successfully joined the competition!");
        detailsForm.reset();
        codeForm.reset();
        setInviteCode("");
        // Close modal after a short delay to show success message
        setTimeout(() => {
          handleCloseModal(); // Use the combined close handler
        }, 2000); // 2-second delay
      }
    } catch (err: any) {
      // Catch unexpected errors during the process
      console.error("Error during submission process:", err);
      setError(
        err.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      // Ensure loading state is turned off unless success message is being shown
      if (!success) {
        // Only set loading to false if not in success state (waiting for timeout)
        setIsLoading(false);
      }
    }
  };

  // Handler to go back from details step to code step
  const handleGoBack = () => {
    setError(null); // Clear errors/success when navigating back
    setSuccess(null);
    detailsForm.reset(); // Reset details form when going back
    setStep("enterCode");
  };

  // Combined handler for closing the modal (cleans up state)
  const handleCloseModal = () => {
    // Reset all states and forms before closing
    setError(null);
    setSuccess(null);
    setIsLoading(false); // Ensure loading is off
    setStep("enterCode"); // Reset to initial step
    codeForm.reset();
    detailsForm.reset();
    setInviteCode(""); // Clear stored invite code
    onClose(); // Call the parent's onClose handler
  };

  return (
    <Modal
      ta="center"
      opened={opened}
      onClose={handleCloseModal} // Use the combined close handler
      // Apply styling directly to the Text component for the title
      title={
        <Text c="black" fz="2.4rem" fw={1000}>
          Enter a Competition
        </Text>
      }
      closeOnClickOutside={!isLoading} // Prevent closing while loading
      withCloseButton={!isLoading} // Hide close button while loading
      closeButtonProps={{ "aria-label": "Close competition modal", size: "sm" }}
      overlayProps={{
        color: "#000", // Or theme.black if using theme context
        opacity: 0.65,
        blur: 3,
      }}
      padding="xl" // Generous padding
      size="md" // Moderate size
      radius="md" // Rounded corners
      shadow="lg" // Noticeable shadow
      zIndex={zIndex} // Use the provided zIndex
      centered // Center the modal vertically and horizontally
    >
      {/* Render the form component, passing all necessary state and handlers */}
      <JoinCompetitionForm
        isLoading={isLoading}
        error={error}
        success={success}
        step={step}
        inviteCode={inviteCode} // Pass invite code for potential display
        codeForm={codeForm}
        detailsForm={detailsForm}
        handleCodeSubmit={handleCodeSubmit}
        handleDetailsSubmit={handleDetailsSubmit}
        handleGoBack={handleGoBack}
        setError={setError} // Pass setError to the form
        setSuccess={setSuccess} // Pass setSuccess to the form
      />
    </Modal>
  );
}
function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
}: {
  initialValues: T;
  validate: { [K in keyof T]?: (value: T[K]) => string | null };
}): any {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = (field: keyof T, value: T[keyof T]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (validate[field]) {
      const error = validate[field]!(value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = (onSubmit: (values: T) => void) => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let hasError = false;

    for (const field in validate) {
      const value = values[field];
      const error = validate[field]?.(value);
      if (error) {
        hasError = true;
        newErrors[field] = error;
      }
    }

    setErrors(newErrors);

    if (!hasError) {
      onSubmit(values);
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    reset,
    submitting: false,
    initialized: true,
    setSubmitting: () => {},
    initialize: () => {},
    validate: () => {},
    clearErrors: () => {},
    setFieldValue: () => {},
    setValues: () => {},
    setFieldError: () => {},
    setErrors: () => {},
    getInputProps: () => ({ value: "", onChange: () => {} }),
  };
}

