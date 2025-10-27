// src/components/JoinCompetitionModal.tsx
import React, { useState } from "react";
import { Modal, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
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
  zIndex = 1000,
}: JoinCompetitionModalProps) {
  const [step, setStep] = useState<"enterCode" | "enterDetails">("enterCode");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState("");

  const codeForm = useForm({
    initialValues: { code: "" },
    validate: {
      code: (value) => (value.trim() ? null : "Invite code is required"),
    },
  });

  const detailsForm = useForm({
    initialValues: { playerName: "", videoUrl: "" },
    validate: {
      playerName: (value) => (value.trim() ? null : "Your name is required"),
      videoUrl: (value) => {
        if (!value.trim()) return "Video URL is required";
        try {
          new URL(value);
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

  const handleCodeSubmit = (values: { code: string }) => {
    setError(null);
    setSuccess(null);
    setInviteCode(values.code.trim());
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
      console.error("Submission attempted without an invite code.");
      setError("Invite code missing. Please go back and enter it.");
      setIsLoading(false);
      return;
    }

    try {
      const { error: rpcError } = await supabase.rpc("join_competition", {
        code: inviteCode,
        player_name: values.playerName.trim(),
        video_url: values.videoUrl.trim(),
      });

      if (rpcError) {
        if (rpcError.message.includes("Competition code does not exist")) {
          setError("Invalid or expired invite code. Please check the code and try again.");
        } else if (rpcError.message.includes("value too long")) {
          setError("One of the fields entered is too long. Please shorten it.");
        } else if (rpcError.message.includes("already joined")) {
          setError("You have already joined this competition.");
        } else {
          setError("Failed to join competition due to an error. Please try again later.");
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
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      if (!success) {
        setIsLoading(false);
      }
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

  return (
    <Modal
      ta="center"
      opened={opened}
      onClose={handleCloseModal}
      title={
        <Text c="black" fz="2.4rem" fw={1000}>
          Enter a Competition
        </Text>
      }
      closeOnClickOutside={!isLoading}
      withCloseButton={!isLoading}
      closeButtonProps={{ "aria-label": "Close competition modal", size: "sm" }}
      overlayProps={{
        color: "#000",
        opacity: 0.65,
        blur: 3,
      }}
      padding="xl"
      size="md"
      radius="md"
      shadow="lg"
      zIndex={zIndex}
      centered
    >
      <JoinCompetitionForm
        isLoading={isLoading}
        error={error}
        success={success}
        step={step}
        inviteCode={inviteCode}
        codeForm={codeForm}
        detailsForm={detailsForm}
        handleCodeSubmit={handleCodeSubmit}
        handleDetailsSubmit={handleDetailsSubmit}
        handleGoBack={handleGoBack}
        setError={setError}
        setSuccess={setSuccess}
      />
    </Modal>
  );
}
