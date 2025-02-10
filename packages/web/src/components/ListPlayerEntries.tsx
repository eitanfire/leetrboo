import React, { useEffect } from "react";
import { Row, Col, Spinner } from "reactstrap";
import { usePlayerEntries as usePlayerEntriesService } from "../services/playerEntry";
import { Competition } from "../services/competitionService";

interface ListPlayerEntriesProps {
  selectedCompetition?: Competition | null;
}

const ListPlayerEntries: React.FC<ListPlayerEntriesProps> = ({
  selectedCompetition,
}) => {
  const {
    playerEntries: list,
    isLoading,
    error,
    refreshPlayerEntries,
  } = usePlayerEntriesService(selectedCompetition?.id);

  useEffect(() => {
    console.log(
      "ListPlayerEntries - Competition changed:",
      selectedCompetition?.id
    );
  }, [selectedCompetition]);

  useEffect(() => {
    console.log("ListPlayerEntries - Entries updated:", list.length);
  }, [list]);

  if (isLoading) {
    return (
      <div className="text-center p-4">
        <Spinner color="primary" />
        <div className="mt-2">Loading player entries...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        Error: {error}
        <button className="btn btn-link" onClick={() => refreshPlayerEntries()}>
          Retry
        </button>
      </div>
    );
  }

  if (!selectedCompetition) {
    return (
      <div className="alert alert-info">
        Please select a competition to view entries.
      </div>
    );
  }

  return (
    <div className="list-player-entries">
      <h3>Entries for {selectedCompetition.name}</h3>
      {list.length === 0 ? (
        <div className="alert alert-info">No player entries found.</div>
      ) : (
        <div className="mt-3">
          {list.map((item) => (
            <Row key={item.id} className="mb-2 p-2 border-bottom">
              <Col md={4} className="player-name">
                {item.player_name}
              </Col>
              <Col md={8}>
                <a
                  href={item.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary btn-sm"
                >
                  🎤 View Entry
                </a>
              </Col>
            </Row>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListPlayerEntries;
