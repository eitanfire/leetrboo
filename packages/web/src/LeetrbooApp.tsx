// src/LeetrbooApp.tsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Alert,
  Spinner,
  Button,
  InputGroup, // Use InputGroup for copy button
  Input, // Use Input (read-only) to display code
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Header from "./components/Header";
import ParticipantForm from "./components/AddPlayerForm"; // Renamed for clarity? Original was ParticipantForm
import ListPlayerEntries from "./components/ListPlayerEntries";
import { Competition, useCompetitions } from "./services/competitionService";
import { useAuth } from "./contexts/AuthContext";

const LeetrbooApp: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [selectedCompetition, setSelectedCompetition] =
    useState<Competition | null>(null);
  const {
    competitions,
    isLoading: competitionsLoading,
    error,
  } = useCompetitions();
  const [copySuccess, setCopySuccess] = useState<string>(""); // State for copy feedback

  // --- (useEffect hooks for auth and initial selection remain the same) ---
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/signin", { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (competitions.length > 0 && !selectedCompetition) {
      setSelectedCompetition(competitions[0]);
      console.log("Selected initial competition:", competitions[0]);
    }
  }, [competitions, selectedCompetition]);

  // --- (Loading and Error states remain the same) ---
  if (authLoading || competitionsLoading) {
    // ... loading spinner ...
    return <div>Loading...</div>; // Placeholder
  }
  if (error) {
    // ... error alert ...
    return <div>Error loading: {error.message}</div>; // Placeholder
  }
  if (competitions.length === 0) {
    // ... no competitions alert ...
    return <div>No competitions found.</div>; // Placeholder
  }

  // Function to handle copying the code
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopySuccess("Copied!");
        setTimeout(() => setCopySuccess(""), 2000); // Clear message after 2 seconds
      },
      (err) => {
        setCopySuccess("Failed to copy");
        console.error("Could not copy text: ", err);
        setTimeout(() => setCopySuccess(""), 2000);
      }
    );
  };

  return (
    <Container fluid className="p-0">
      <Header />
      <Container className="mt-4">
        {/* --- Competition Selection and Player Form --- */}
        <Row>
          <Col md={6}>
            {" "}
            {/* Adjust column layout as needed */}
            <ParticipantForm // This seems to be where competition is selected too?
              selectedCompetition={selectedCompetition}
              onCompetitionSelect={(competition) => {
                setSelectedCompetition(competition);
                setCopySuccess(""); // Clear copy message on selection change
                console.log("Competition selected:", competition);
              }}
              competitions={competitions}
            />
          </Col>

          {/* --- Display Invite Code Section (Admin View) --- */}
          {selectedCompetition && selectedCompetition.competition_code && (
            <Col md={6}>
              {" "}
              {/* Adjust column layout */}
              <h5>Invite Participants</h5>
              <p>Share this code with participants so they can join:</p>
              <InputGroup>
                <Input
                  readOnly
                  value={selectedCompetition.competition_code}
                  style={{
                    fontFamily: "monospace",
                    backgroundColor: "#e9ecef",
                  }} // Style for clarity
                />
                <Button
                  color={copySuccess === "Copied!" ? "success" : "secondary"}
                  onClick={() =>
                    copyToClipboard(selectedCompetition.competition_code)
                  }
                  disabled={!!copySuccess && copySuccess !== "Copied!"} // Disable briefly on fail
                >
                  {copySuccess ? copySuccess : "Copy"}
                </Button>
              </InputGroup>
              <small className="text-muted">
                Participants can enter this code on the main page via "Enter a
                Competition".
              </small>
            </Col>
          )}
        </Row>

        {/* --- List Player Entries --- */}
        {selectedCompetition && (
          <Row className="mt-4">
            <Col>
              <ListPlayerEntries
                key={selectedCompetition.id}
                selectedCompetition={selectedCompetition}
              />
            </Col>
          </Row>
        )}
      </Container>
    </Container>
  );
};

export default LeetrbooApp;
