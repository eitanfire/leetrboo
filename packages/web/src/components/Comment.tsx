import React, { useState } from "react";
import { Spinner } from "reactstrap";

interface CommentProps {
  entryId: string;
  initialComments?: string;
  onUpdate: (entryId: string, comments: string) => Promise<void>;
}

const Comment: React.FC<CommentProps> = ({ entryId, initialComments, onUpdate }) => {
  const [comments, setComments] = useState<string>(initialComments || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCommentsChange = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await onUpdate(entryId, comments);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update comments");
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
      <div style={{ position: "relative" }}>
        <textarea
          className="form-control"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          onBlur={handleCommentsChange}
          onKeyDown={(e) => {
            // Save on Cmd/Ctrl + Enter
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              handleCommentsChange();
            }
            // Cancel on Escape
            if (e.key === "Escape") {
              setComments(initialComments || "");
              setIsEditing(false);
            }
          }}
          autoFocus
          rows={3}
          placeholder="Add comments... (Cmd/Ctrl+Enter to save, Esc to cancel)"
          style={{
            resize: "vertical",
            minHeight: "80px",
            fontSize: "14px",
            padding: "8px 12px",
            border: "2px solid #4CAF50",
            borderRadius: "4px",
            width: "100%"
          }}
        />
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      style={{
        cursor: "pointer",
        minHeight: "40px",
        padding: "8px 12px",
        borderRadius: "4px",
        border: "1px solid transparent",
        transition: "all 0.2s ease",
        backgroundColor: comments ? "transparent" : "#f8f9fa"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#f8f9fa";
        e.currentTarget.style.borderColor = "#dee2e6";
      }}
      onMouseLeave={(e) => {
        if (!comments) {
          e.currentTarget.style.backgroundColor = "#f8f9fa";
        } else {
          e.currentTarget.style.backgroundColor = "transparent";
        }
        e.currentTarget.style.borderColor = "transparent";
      }}
    >
      {comments ? (
        <div style={{
          whiteSpace: "pre-wrap",
          fontSize: "14px",
          lineHeight: "1.5",
          color: "#333"
        }}>
          {comments}
        </div>
      ) : (
        <span style={{
          fontStyle: "italic",
          color: "#6c757d",
          fontSize: "14px"
        }}>
          Click to add comments...
        </span>
      )}
    </div>
  );
};

export default Comment;
