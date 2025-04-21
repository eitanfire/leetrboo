// src/components/JoinCompetitionModal.tsx
import { useState } from "react";
import { createStyles } from "@mantine/styles";
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

// Define styles using createStyles
const useStyles = createStyles(() => ({
  modal: {
    "& .mantine-Modal-overlay": {
      backgroundColor: "rgba(0, 0, 0, 0.65)",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
      display: "block",
      opacity: 1,
      visibility: "visible",
    },

    "& .mantine-Modal-root": {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1001,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflowY: "auto",
      padding: "20px",
    },

    "& .mantine-Modal-content": {
      backgroundColor: "#ffffff",
      color: "#212529",
      borderRadius: "8px",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.15)",
      border: "none",
      padding: "24px",
      width: "90%",
      maxWidth: "500px",
      transform: "none",
      overflow: "visible",
      position: "relative",
    },

    "& .mantine-Modal-close": {
      color: "#666",
      right: "16px",
      top: "16px",
    },
  },
}));

interface JoinCompetitionModalProps {
  opened: boolean;
  onClose: () => void;
  zIndex?: number;
}

export function JoinCompetitionModal({
  opened,
  onClose,
}: JoinCompetitionModalProps) {
  // Get our custom styles
  const { classes } = useStyles();

  const [step, setStep] = useState<"enterCode" | "enterDetails">("enterCode");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState("");

  // Form for step 1: Invite Code
  const codeForm = useForm({
    initialValues: {
      code: "",
    },
    validate: {
      code: (value) => (value.trim() ? null : "Invite code is required"),
    },
  });

  // Form for step 2: Player Details
  const detailsForm = useForm({
    initialValues: {
      playerName: "",
      videoUrl: "",
    },
    validate: {
      playerName: (value) => (value.trim() ? null : "Your name is required"),
      videoUrl: (value) => {
        if (!value.trim()) return "Video URL is required";
        try {
          new URL(value);
          return null;
        } catch (_) {
          return "Please enter a valid URL (e.g., https://...)";
        }
      },
    },
  });

  // Handlers remain unchanged
  const handleCodeSubmit = (values: { code: string }) => {
    setError(null);
    setSuccess(null);
    setInviteCode(values.code);
    setStep("enterDetails");
  };

  const handleDetailsSubmit = async (values: {
    playerName: string;
    videoUrl: string;
  }) => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (!inviteCode) {
      console.error("Attempted submission with empty invite code!");
      setError("Invite code missing. Please go back and enter it.");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Calling RPC join_competition with:", {
        code: inviteCode,
        player_name: values.playerName,
        video_url: values.videoUrl,
      });

      const { error: rpcError } = await supabase.rpc("join_competition", {
        code: inviteCode,
        player_name: values.playerName,
        video_url: values.videoUrl,
      });

      console.log("Supabase RPC Response Error:", rpcError);

      if (rpcError) {
        console.error("Supabase RPC Error:", rpcError);
        if (rpcError.message.includes("Competition code does not exist")) {
          setError("Invalid or expired invite code.");
        } else if (rpcError.message.includes("value too long")) {
          setError("One of the fields entered is too long. Please shorten it.");
        } else {
          setError(`Failed to join competition. Please try again.`);
          console.error("Detailed join error:", rpcError.message);
        }
      } else {
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
      setError(
        err.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    setError(null);
    setSuccess(null);
    detailsForm.reset();
    setStep("enterCode");
  };

  const handleCloseModal = () => {
    setError(null);
    setSuccess(null);
    setIsLoading(false);
    setStep("enterCode");
    codeForm.reset();
    detailsForm.reset();
    setInviteCode("");
    onClose();
  };

  // Render content logic unchanged
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
              placeholder="e.g., https://youtube.com/watch?v=..."
              type="url"
              {...detailsForm.getInputProps("videoUrl")}
            />
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

    return null;
  };

  // Using our custom class for styling
  return (
    <Modal
      opened={opened}
      onClose={handleCloseModal}
      title="Enter a Competition"
      closeOnClickOutside={!isLoading}
      withCloseButton={!isLoading}
      closeButtonProps={{ "aria-label": "Close", size: "sm" }}
      className={classes.modal}
    >
      <LoadingOverlay
        visible={isLoading}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

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

      {success && !isLoading && (
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

      {!success && renderStepContent()}
    </Modal>
  );
}
