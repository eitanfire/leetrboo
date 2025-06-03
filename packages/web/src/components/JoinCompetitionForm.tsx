import {
  TextInput,
  Button,
  Stack,
  LoadingOverlay,
  Text,
  Group,
  Alert,
} from "@mantine/core";
import React from "react";
import { UseFormReturnType } from "@mantine/form";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";

interface CodeFormValues {
  code: string;
}

interface DetailsFormValues {
  playerName: string;
  videoUrl: string;
}

interface JoinCompetitionFormProps {
  isLoading: boolean;
  error: string | null;
  success: string | null;
  step: "enterCode" | "enterDetails";
  inviteCode: string;
  codeForm: UseFormReturnType<CodeFormValues>;
  detailsForm: UseFormReturnType<DetailsFormValues>;
  handleCodeSubmit: (values: CodeFormValues) => void;
  handleDetailsSubmit: (values: DetailsFormValues) => Promise<void>;
  handleGoBack: () => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
}

export function JoinCompetitionForm({
  isLoading,
  error,
  success,
  step,
  inviteCode,
  codeForm,
  detailsForm,
  handleCodeSubmit,
  handleDetailsSubmit,
  handleGoBack,
  setError,
  setSuccess,
}: JoinCompetitionFormProps) {
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
              data-autofocus
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
              Entering competition with code:{" "}
              <Text span fw={700}>
                {inviteCode}
              </Text>
            </Text>
            <TextInput
              required
              label="Your Name"
              placeholder="Enter your display name"
              {...detailsForm.getInputProps("playerName")}
              data-autofocus
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

  return (
    <>
      <LoadingOverlay
        visible={isLoading}
        overlayProps={{ radius: "sm", blur: 2 }}
        zIndex={10}
        pos="absolute"
        inset={0}
      />

      {error && (
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Error"
          color="red"
          withCloseButton
          onClose={() => setError(null)}
          mb="md"
          variant="light"
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
          onClose={() => setSuccess(null)} // Or maybe keep it until modal closes
          mb="md"
          variant="light"
        >
          {success}
        </Alert>
      )}

      {!success && renderStepContent()}
    </>
  );
}
