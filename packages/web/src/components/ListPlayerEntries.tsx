import React from "react";
import { Row, Col } from "reactstrap";
import { usePlayerEntries as usePlayerEntriesService } from "../services/playerEntry";

const ListPlayerEntries: React.FC = () => {
  const { playerEntries: list, isLoading, error } = usePlayerEntriesService();

  if (isLoading) {
    return <div>Loading player entries...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="list-player-entries">
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
