import React, { useState } from "react";
import { supabase } from "../services/supabaseClient"; // You'll need to ensure this exists
import { Spinner } from "reactstrap";

interface ScoreProps {
  entryId: string;
  initialScore?: number;
}

const Score: React.FC<ScoreProps> = ({ entryId, initialScore }) => {
  const [score, setScore] = useState<number | undefined>(initialScore);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScoreChange = async (newScore: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from("player_entries")
        .update({ score: newScore })
        .eq("id", entryId);

      if (updateError) throw updateError;

      setScore(newScore);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update score");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Spinner size="sm" color="primary" />;
  }

  if (error) {
    return <span className="text-danger">Error: {error}</span>;
  }

  if (isEditing) {
    return (
      <input
        type="number"
        className="form-control form-control-sm"
        value={score || ""}
        onChange={(e) => {
          const value = e.target.value
            ? parseInt(e.target.value, 10)
            : undefined;
          setScore(value);
        }}
        onBlur={() => {
          if (score !== undefined) {
            handleScoreChange(score);
          }
        }}
        onKeyPress={(e) => {
          if (e.key === "Enter" && score !== undefined) {
            handleScoreChange(score);
          }
        }}
        autoFocus
      />
    );
  }

  return (
    <div
      className="d-flex align-items-center cursor-pointer"
      onClick={() => setIsEditing(true)}
      style={{ cursor: "pointer" }}
    >
      <span className="me-2">Score:</span>
      {score !== undefined ? score : "-"}
    </div>
  );
};

export default Score;
