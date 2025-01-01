// ParticipantForm.tsx
import React, { useState, useEffect } from "react";
import { Col } from "reactstrap";
import { usePlayerEntries, PlayerEntry } from "../services/playerEntry";
import { useCompetition } from "../services/competitionService";

const ParticipantForm: React.FC = () => {
  const {
    playerEntries,
    isLoading: entriesLoading,
    insertPlayerEntry,
  } = usePlayerEntries();
  const {
    competition,
    isLoading: competitionLoading,
    createCompetition,
  } = useCompetition();

  const [formData, setFormData] = useState<PlayerEntry>({
    player_name: "",
    video_url: "",
  });

  const [errors, setErrors] = useState<{
    player_name?: string;
    video_url?: string;
  }>({});

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showNewCompetitionForm, setShowNewCompetitionForm] = useState(false);
  const [newCompetitionName, setNewCompetitionName] = useState("");

  const isValidYouTubeUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return (
        ((urlObj.hostname === "www.youtube.com" ||
          urlObj.hostname === "youtube.com") &&
          !!urlObj.searchParams.get("v")) ||
        (urlObj.hostname === "youtu.be" && !!urlObj.pathname.slice(1))
      );
    } catch {
      return false;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.player_name.trim()) {
      newErrors.player_name = "Name is required";
    }

    if (!formData.video_url.trim()) {
      newErrors.video_url = "Video URL is required";
    } else if (!isValidYouTubeUrl(formData.video_url)) {
      newErrors.video_url = "Please enter a valid YouTube URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    if (!competition) {
      setSubmitError("Please create a competition first");
      return;
    }

    if (validateForm()) {
      try {
        await insertPlayerEntry({
          ...formData,
          competition_id: competition.id,
        });

        setFormData({
          player_name: "",
          video_url: "",
        });
        setErrors({});
      } catch (error) {
        console.error("Error submitting player entry:", error);
        setSubmitError(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
      }
    }
  };

  const handleCreateCompetition = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCompetition(newCompetitionName);
      setShowNewCompetitionForm(false);
      setNewCompetitionName("");
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Error creating competition"
      );
    }
  };

  if (competitionLoading) {
    return <div>Loading competition data...</div>;
  }

  if (!competition && !showNewCompetitionForm) {
    return (
      <Col>
        <div className="mb-4">
          <h2>Create Your Competition</h2>
          <p>You need to create a competition before adding participants.</p>
          <button
            onClick={() => setShowNewCompetitionForm(true)}
            className="primary"
          >
            Create Competition
          </button>
        </div>
      </Col>
    );
  }

  if (showNewCompetitionForm) {
    return (
      <Col>
        <form onSubmit={handleCreateCompetition} className="mb-4">
          <h2>Create Competition</h2>
          <div>
            <label htmlFor="competition_name">Competition Name:&nbsp;</label>
            <input
              id="competition_name"
              value={newCompetitionName}
              onChange={(e) => setNewCompetitionName(e.target.value)}
              placeholder="Enter competition name"
              required
            />
          </div>
          <button type="submit" className="primary">
            Create Competition
          </button>
          {submitError && <div className="error-message">{submitError}</div>}
        </form>
      </Col>
    );
  }

  return (
    <Col>
      <div className="mb-4">
        <h2>{competition?.name}</h2>
      </div>
      <form onSubmit={handleSubmit} className="add-player-form hstack">
        <span className="add-player-form-title">Add Participant</span>
        <div>
          <label htmlFor="player_name">Name:&nbsp;</label>
          <input
            id="player_name"
            name="player_name"
            value={formData.player_name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, player_name: e.target.value }))
            }
            placeholder="Enter participant's name"
            className={errors.player_name ? "error" : ""}
          />
          {errors.player_name && (
            <div className="error-message">{errors.player_name}</div>
          )}
        </div>
        <div>
          <label htmlFor="video_url">YouTube video URL:&nbsp;</label>
          <input
            id="video_url"
            name="video_url"
            value={formData.video_url}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, video_url: e.target.value }))
            }
            placeholder="Enter YouTube URL"
            className={errors.video_url ? "error" : ""}
          />
          {errors.video_url && (
            <div className="error-message">{errors.video_url}</div>
          )}
        </div>
        <button type="submit" className="primary">
          Add Participant
        </button>
        {submitError && <div className="error-message">{submitError}</div>}
        <div>
          Total participants:{" "}
          {entriesLoading ? "Loading..." : playerEntries.length}
        </div>
      </form>
    </Col>
  );
};

export default ParticipantForm;
