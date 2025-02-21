import React, { useMemo } from "react";
import { Table, Spinner, Alert } from "reactstrap";
import { usePlayerEntries } from "../services/playerEntry";
import type { Competition } from "../services/competitionService";
import Score from "./Score";

interface ListPlayerEntriesProps {
  selectedCompetition: Competition;
}

const ListPlayerEntries: React.FC<ListPlayerEntriesProps> = ({
  selectedCompetition,
}) => {
  const { playerEntries, isLoading, error } = usePlayerEntries(
    selectedCompetition.id.toString()
  );

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
    <div>
      <h3>Entries for {selectedCompetition.name}</h3>
      <Table striped responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Video</th>
            <th>Score</th>
            <th>Submitted</th>
          </tr>
        </thead>
        <tbody>
          {sortedEntries.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.player_name}</td>
              <td>
                <a
                  href={entry.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button> 🎤 Watch Video</button>
                </a>
              </td>
              <td>
                <Score entryId={entry.id} initialScore={entry.score} />
              </td>
              <td>{new Date(entry.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ListPlayerEntries;