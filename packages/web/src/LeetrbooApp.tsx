// src/LeetrbooApp.tsx
import React, { useState, useEffect } from "react";
// --- Reactstrap Imports (Keep) ---
import { Container, Row, Col, Alert, Spinner, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
// --- Bootstrap CSS (Keep for Reactstrap) ---
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// --- Mantine Imports (Add ONLY for the new section) ---
import {
  TextInput,
  Group,
  CopyButton,
  Tooltip,
  ActionIcon,
  Text,
  Stack, // For vertical layout within the new section
  Title, // For the heading within the new section
} from "@mantine/core";
import { IconCopy, IconCheck } from "@tabler/icons-react"; // Icons for copy button

// --- Your Component Imports ---
import Header from "./components/Header";
import ParticipantForm from "./components/AddPlayerForm";
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

  // Handle auth state changes (Keep)
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/signin", { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Automatically select the first competition when data loads (Keep)
  useEffect(() => {
    if (competitions.length > 0 && !selectedCompetition) {
      setSelectedCompetition(competitions[0]);
      console.log("Selected initial competition:", competitions[0]);
    }
  }, [competitions, selectedCompetition]);

  // Handle loading states (Keep Reactstrap)
  if (authLoading || competitionsLoading) {
    return (
      <Container fluid className="p-0">
        <Header />
        <Container className="mt-4">
          <Row>
            <Col
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: "200px" }}
            >
              <div className="text-center">
                <Spinner color="primary" />
                <div className="mt-2">
                  {authLoading
                    ? "Verifying authentication..."
                    : "Loading competitions..."}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </Container>
    );
  }

  // Handle errors (Keep Reactstrap)
  if (error) {
    return (
      <Container fluid className="p-0">
        <Header />
        <Container className="mt-4">
          <Row>
            <Col>
              <Alert color="danger">
                Error loading competitions: {error.message}
                <Button
                  color="link"
                  className="d-block mt-2"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </Alert>
            </Col>
          </Row>
        </Container>
      </Container>
    );
  }

  // Handle no competitions case (Keep Reactstrap)
  if (competitions.length === 0) {
    return (
      <Container fluid className="p-0">
        <Header />
        <Container className="mt-4">
          <Row>
            <Col>
              <Alert color="info">
                No competitions available. Please create a new competition to
                get started.
              </Alert>
            </Col>
          </Row>
        </Container>
      </Container>
    );
  }

  // --- Main Content ---
  return (
    <Container fluid className="p-0">
      <Header />
      <Container className="mt-4">
        {/* --- Row 1: Participant Form --- */}
        <Row>
          <Col>
            <ParticipantForm
              selectedCompetition={selectedCompetition}
              onCompetitionSelect={(competition) => {
                setSelectedCompetition(competition);
                console.log("Competition selected:", competition);
              }}
              // VVV Pass the competitions prop VVV
              competitions={competitions}
            />
          </Col>
        </Row>

        {/* --- Row 2: Invite Participants Section (Uses Mantine Inside) --- */}
        {/* Only show if a competition with a code is selected */}
        {selectedCompetition && selectedCompetition.competition_code && (
          <Row className="mt-3 mb-3">
            {" "}
            {/* Add vertical margin */}
            <Col>
              {/* Using Mantine Stack for vertical layout within this section */}
              <Stack gap="xs">
                <Title order={5}>Invite Participants</Title>
                <Text size="sm">
                  Share this code with participants so they can join:
                </Text>
                {/* Using Mantine Group for horizontal layout of input + button */}
                <Group gap="xs" wrap="nowrap">
                  {/* Mantine TextInput for displaying the code */}
                  <TextInput
                    readOnly
                    value={selectedCompetition.competition_code}
                    // Apply monospace font specifically to the code
                    style={{ fontFamily: "monospace", flexGrow: 1 }}
                    aria-label="Competition Invite Code"
                  />
                  {/* Mantine CopyButton Helper */}
                  <CopyButton
                    value={selectedCompetition.competition_code}
                    timeout={2000}
                  >
                    {({ copied, copy }) => (
                      <Tooltip
                        label={copied ? "Copied!" : "Copy code"}
                        withArrow
                        position="right"
                      >
                        <ActionIcon
                          color={copied ? "teal" : "gray"}
                          variant="subtle"
                          onClick={copy}
                        >
                          {copied ? (
                            <IconCheck size="1rem" />
                          ) : (
                            <IconCopy size="1rem" />
                          )}
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </CopyButton>
                </Group>
                <Text size="xs" c="dimmed">
                  Participants can enter this code via "Enter a Competition".
                </Text>
              </Stack>
            </Col>
          </Row>
        )}

        {/* --- Row 3: List Player Entries --- */}
        {/* Only show if a competition is selected */}
        {selectedCompetition && (
          <Row className="mt-4">
            <Col>
              <ListPlayerEntries
                key={selectedCompetition.id} // Force re-render when competition changes
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
