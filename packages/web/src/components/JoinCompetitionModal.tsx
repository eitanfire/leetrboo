import { useState } from "react";
import {
  Modal,
  TextInput,
  Button,
  Stack,
  LoadingOverlay,
  Text,
  Group,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import { supabase } from "../services/supabaseClient";

interface JoinCompetitionModalProps {
  opened: boolean;
  onClose: () => void;
}

export function JoinCompetitionModal({
  opened,
  onClose,
}: JoinCompetitionModalProps) {
  const [step, setStep] = useState<"enterCode" | "enterDetails">("enterCode");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState(""); // Store the validated code

  // Form for step 1: Invite Code
  const codeForm = useForm({
    initialValues: {
      code: "",
    },
    validate: {
      code: (value) => (value.trim() ? null : "Invite code is required"),
      // Basic UUID format check (optional but good UX)
      // code: (value) => (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value) ? null : 'Invalid invite code format'),
    },
  });

  // Form for step 2: Player Details
  const detailsForm = useForm({
    initialValues: {
      playerName: "",
      videoUrl: "",
      // avatar: '', // Add avatar later
    },
    validate: {
      playerName: (value) => (value.trim() ? null : "Your name is required"),
      videoUrl: (value) => {
        if (!value.trim()) return "Video URL is required";
        try {
          new URL(value); // Basic URL validation
          return null;
        } catch (_) {
          return "Please enter a valid URL (e.g., https://...)";
        }
      },
    },
  });

  // --- Handlers ---

  const handleCodeSubmit = (values: { code: string }) => {
    setError(null); // Clear previous errors
    setSuccess(null);
    setInviteCode(values.code); // Store the code
    setStep("enterDetails");
  };

  const handleDetailsSubmit = async (values: {
    playerName: string;
    videoUrl: string;
  }) => {
    setError(null); // Clear previous errors
    setSuccess(null);
    setIsLoading(true);

    try {
      const { error: rpcError } = await supabase.rpc("join_competition", {
        code: inviteCode,
        player_name: values.playerName,
        video_url: values.videoUrl,
      });

      if (rpcError) {
        // Handle specific errors if needed, otherwise show generic message
        console.error("Supabase RPC Error:", rpcError);
        // Check for the specific error from your function
        if (rpcError.message.includes("Competition code does not exist")) {
          setError("Invalid or expired invite code.");
          // Optional: Go back to step 1 if code is invalid
          // setStep('enterCode');
        } else {
          setError(`Failed to join competition: ${rpcError.message}`);
        }
      } else {
        // Success!
        setSuccess("Successfully joined the competition!");
        detailsForm.reset();
        codeForm.reset();
        setInviteCode("");
        setTimeout(() => {
          handleCloseModal();
        }, 2000);
      }
    } catch (err: any) {
      console.error("Submission Error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    setError(null);
    setSuccess(null);
    detailsForm.reset(); // Clear details form if going back
    setStep("enterCode");
  };

  const handleCloseModal = () => {
    // Reset state completely when closing
    setError(null);
    setSuccess(null);
    setIsLoading(false);
    setStep("enterCode");
    codeForm.reset();
    detailsForm.reset();
    setInviteCode("");
    onClose(); // Call the parent's onClose handler
  };

  // --- Render Logic ---

  const renderStepContent = () => {
    if (step === "enterCode") {
      return (
        <form onSubmit={codeForm.onSubmit(handleCodeSubmit)}>
          <Stack>
            <TextInput
              required
              label="Invite Code"
              placeholder="Enter the competition invite code"
              {...codeForm.getInputProps("code")}
            />
            <Button type="submit" loading={isLoading}>
              Next
            </Button>
          </Stack>
        </form>
      );
    }

    if (step === "enterDetails") {
      return (
        <form onSubmit={detailsForm.onSubmit(handleDetailsSubmit)}>
          <Stack>
            <Text size="sm" c="dimmed" mb="md">
              Entering competition with code: {inviteCode}
            </Text>
            <TextInput
              required
              label="Your Name"
              placeholder="Enter your display name"
              {...detailsForm.getInputProps("playerName")}
            />
            <TextInput
              required
              label="Video URL"
              placeholder="https://youtube.com/your-video-id or similar"
              type="url"
              {...detailsForm.getInputProps("videoUrl")}
            />
            {/* Add Avatar selection here later */}
            <Group justify="space-between" mt="md">
              <Button
                variant="default"
                onClick={handleGoBack}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button type="submit" loading={isLoading}>
                Join Competition
              </Button>
            </Group>
          </Stack>
        </form>
      );
    }

    return null; // Should not happen
  };

  return (
    <Modal
      opened={opened}
      onClose={handleCloseModal} // Use our reset logic on close
      title="Enter a Competition"
      size="sm"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <LoadingOverlay
        visible={isLoading}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      {/* Display Error Messages */}
      {error && (
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Error"
          color="red"
          withCloseButton
          onClose={() => setError(null)}
          mb="md"
        >
          {error}
        </Alert>
      )}
      {/* Display Success Message */}
      {success &&
        !isLoading && ( // Don't show success if loading again right away
          <Alert
            icon={<IconCheck size="1rem" />}
            title="Success"
            color="green"
            withCloseButton
            onClose={() => setSuccess(null)}
            mb="md"
          >
            {success}
          </Alert>
        )}
      {/* Render the current step's form */}
      {!success && renderStepContent()}{" "}
      {/* Don't render form if success message is shown */}
    </Modal>
  );
}
