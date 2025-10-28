import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { extractYouTubeVideoId } from "../utils/youtube";

interface YouTubePlayerProps {
  videoUrl: string;
  playerName: string;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoUrl, playerName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const videoId = extractYouTubeVideoId(videoUrl);

  const toggle = () => setIsOpen(!isOpen);

  if (!videoId) {
    // If we can't extract a video ID, fall back to opening the link in a new tab
    return (
      <a href={videoUrl} target="_blank" rel="noopener noreferrer">
        <button>🎤 Watch Video</button>
      </a>
    );
  }

  return (
    <>
      <button onClick={toggle}>🎤 Watch Video</button>

      <Modal isOpen={isOpen} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle}>
          {playerName}'s Performance
        </ModalHeader>
        <ModalBody>
          <div className="ratio ratio-16x9">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={`${playerName}'s video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default YouTubePlayer;
