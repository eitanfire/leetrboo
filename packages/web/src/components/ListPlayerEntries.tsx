import React from "react";
import { Row, Col } from "reactstrap";
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
  } = usePlayerEntriesService(selectedCompetition?.id);

  if (isLoading) {
    return <div>Loading player entries...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!selectedCompetition) {
    return <div>Please select a competition to view entries.</div>;
  }

  return (
    <div className="list-player-entries">
      <h3>Entries for {selectedCompetition.name}</h3>
      {list.length === 0 ? (
        <div>No player entries found.</div>
      ) : (
        list.map((item) => (
          <Row key={item.id}>
            <Col className="player-name">{item.player_name}</Col>
            <Col>
              <a
                href={item.video_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button>🎤 {item.video_url}</button>
              </a>
            </Col>
          </Row>
        ))
      )}
    </div>
  );
};

export default ListPlayerEntries;
