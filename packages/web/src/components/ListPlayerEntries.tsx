import React, { useMemo, useState } from "react";
import { Table, Spinner, Alert, Button } from "reactstrap";
import { usePlayerEntries } from "../services/playerEntry";
import type { Competition } from "../services/competitionService";
import Score from "./Score";
import YouTubePlayer from "./YouTubePlayer";

interface ListPlayerEntriesProps {
  selectedCompetition: Competition;
}

const ListPlayerEntries: React.FC<ListPlayerEntriesProps> = ({
  selectedCompetition,
}) => {
  const { playerEntries, isLoading, error, deletePlayerEntry } = usePlayerEntries(
    selectedCompetition.id.toString()
  );
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const handleDelete = async (entryId: string, playerName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${playerName}'s entry?`)) {
      return;
    }

    setDeletingIds((prev) => new Set(prev).add(entryId));

    try {
      console.log('Attempting to delete entry:', entryId);
      await deletePlayerEntry(entryId);
      console.log('Delete successful for entry:', entryId);
      // Successfully deleted - remove from loading state
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(entryId);
        return next;
      });
    } catch (err) {
      console.error('Delete failed:', err);
      alert(`Failed to delete entry: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(entryId);
        return next;
      });
    }
  };

  // Sort entries: scored entries first (highest to lowest), then unscored entries
  const sortedEntries = useMemo(() => {
    if (!playerEntries) return [];

    return [...playerEntries].sort((a, b) => {
      // If both entries have scores, sort by score (highest first)
      if (
        a.score !== null &&
        a.score !== undefined &&
        b.score !== null &&
        b.score !== undefined
      ) {
        return b.score - a.score;
      }

      // If only a has a score, it comes first
      if (a.score !== null && a.score !== undefined) {
        return -1;
      }

      // If only b has a score, it comes first
      if (b.score !== null && b.score !== undefined) {
        return 1;
      }

      // If neither has a score, sort by created_at (most recent first)
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  }, [playerEntries]);

  if (isLoading) {
    return (
      <div className="text-center p-4">
        <Spinner color="primary" />
        <div className="mt-2">Loading entries...</div>
      </div>
    );
  }

  if (error) {
    return <Alert color="danger">Error loading player entries: {error}</Alert>;
  }

  if (playerEntries.length === 0) {
    return (
      <Alert color="info">No entries yet for {selectedCompetition.name}</Alert>
    );
  }

  return (
    <div className="add-player-form">
      <h3 className="add-player-form-title">
        Entries for {selectedCompetition.name}
      </h3>
      <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Video</th>
            <th>Score</th>
            <th>Delete</th>
            {/* <th>Submitted</th> */}
          </tr>
        </thead>
        <tbody className="list-player-entries">
          {sortedEntries.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.player_name}</td>
              <td>
                <YouTubePlayer
                  videoUrl={entry.video_url}
                  playerName={entry.player_name}
                />
              </td>
              <td>
                <Score entryId={entry.id} initialScore={entry.score} />
              </td>
              <td>
                <Button
                  color="danger"
                  size="sm"
                  onClick={() => handleDelete(entry.id, entry.player_name)}
                  disabled={deletingIds.has(entry.id)}
                >
                  {deletingIds.has(entry.id) ? 'Deleting...' : 'Delete'}
                </Button>
              </td>
              {/* <td>{new Date(entry.created_at).toLocaleDateString()}</td> */}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ListPlayerEntries;